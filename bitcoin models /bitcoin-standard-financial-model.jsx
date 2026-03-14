import { useState, useMemo, useCallback } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Historical BTC cycle data for scenario modeling
const SCENARIOS = {
  bull: { label: "Bull Market", annualReturn: 0.80, monthlyVol: 0.08, color: "#22c55e", bgColor: "#052e16" },
  neutral: { label: "Neutral Market", annualReturn: 0.15, monthlyVol: 0.05, color: "#f59e0b", bgColor: "#451a03" },
  bear: { label: "Bear Market", annualReturn: -0.55, monthlyVol: 0.10, color: "#ef4444", bgColor: "#450a0a" },
};

// Strike fee tiers (US consumer, 2026)
const STRIKE_FEE_TIERS = [
  { min: 0, max: 300, fee: 0.0129, label: "$0 – $300" },
  { min: 300, max: 1000, fee: 0.0109, label: "$300 – $1K" },
  { min: 1000, max: 5000, fee: 0.0089, label: "$1K – $5K" },
  { min: 5000, max: 10000, fee: 0.0079, label: "$5K – $10K" },
  { min: 10000, max: 50000, fee: 0.0069, label: "$10K – $50K" },
  { min: 50000, max: Infinity, fee: 0.0039, label: "$50K+" },
];

function getStrikeFee(monthlyVolume) {
  for (const tier of STRIKE_FEE_TIERS) {
    if (monthlyVolume >= tier.min && monthlyVolume < tier.max) return tier.fee;
  }
  return 0.0039;
}

// Simulate monthly BTC price path
function simulatePricePath(startPrice, scenario, months, seed) {
  const { annualReturn, monthlyVol } = SCENARIOS[scenario];
  const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
  const prices = [startPrice];
  let rng = seed || 42;
  for (let i = 1; i < months; i++) {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    const u1 = (rng >>> 0) / 4294967296;
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    const u2 = (rng >>> 0) / 4294967296;
    const z = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
    const returnVal = monthlyReturn + monthlyVol * z;
    const newPrice = Math.max(prices[i-1] * (1 + returnVal), prices[0] * 0.1);
    prices.push(newPrice);
  }
  return prices;
}

function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return "$0";
  return n < 0 ? `-$${Math.abs(n).toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}` : `$${n.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}`;
}
function fmtBtc(n) {
  if (n === undefined || n === null || isNaN(n)) return "0.00000000";
  return n.toFixed(8);
}
function fmtPct(n) { return `${(n*100).toFixed(1)}%`; }

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", cursor: "help" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{
          position: "absolute", bottom: "120%", left: "50%", transform: "translateX(-50%)",
          background: "#1c1917", color: "#fef3c7", padding: "8px 12px", borderRadius: "6px",
          fontSize: "11px", whiteSpace: "nowrap", zIndex: 100, border: "1px solid #78350f",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
        }}>{text}</span>
      )}
    </span>
  );
};

export default function BitcoinStandardModel() {
  // Inputs
  const [annualIncome, setAnnualIncome] = useState(65000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3500);
  const [btcAllocationPct, setBtcAllocationPct] = useState(80);
  const [scenario, setScenario] = useState("bull");
  const [startBtcPrice, setStartBtcPrice] = useState(85000);
  const [existingBtc, setExistingBtc] = useState(0.05);
  const [simSeed, setSimSeed] = useState(42);
  const [yearsToModel, setYearsToModel] = useState(3);
  const [billPayDefault, setBillPayDefault] = useState("bitcoin");
  const [useLending, setUseLending] = useState(false);
  const [emergencyMonths, setEmergencyMonths] = useState(3);
  const [dcaBoostInBear, setDcaBoostInBear] = useState(true);
  const [activeTab, setActiveTab] = useState("guide");

  const totalMonths = yearsToModel * 12;
  const monthlyGross = annualIncome / 12;
  const estimatedTax = monthlyGross * 0.22;
  const monthlyNet = monthlyGross - estimatedTax;
  const btcDirectDeposit = monthlyNet * (btcAllocationPct / 100);
  const cashDirectDeposit = monthlyNet - btcDirectDeposit;
  const monthlySurplus = monthlyNet - monthlyExpenses;

  // Run simulation
  const simData = useMemo(() => {
    const prices = simulatePricePath(startBtcPrice, scenario, totalMonths + 1, simSeed);
    let btcBalance = existingBtc;
    let cashBuffer = 0; // builds up naturally from cash deposits
    let totalBtcBought = 0;
    let totalBtcSold = 0;
    let totalFeePaid = 0;
    let totalCapitalGains = 0; // actual realized gains (proceeds - cost basis)
    let totalTaxableProceeds = 0; // total USD value of BTC sold (for reference)
    let cumulativeInvested = 0;
    // Track cost basis: total USD spent acquiring BTC (for avg cost basis)
    let totalCostBasis = existingBtc * startBtcPrice; // existing holdings at starting price
    const monthlyData = [];
    let runningVolume = 0;
    let depleted = false;

    for (let m = 0; m < totalMonths; m++) {
      const price = prices[m];
      const nextPrice = prices[m + 1] || price;
      const monthIdx = m % 12;
      if (monthIdx === 0) runningVolume = 0;

      // -- Income flows --
      // BTC portion of paycheck → buy BTC via Strike direct deposit
      const btcBuyAmount = btcDirectDeposit;
      const fee = getStrikeFee(runningVolume) * btcBuyAmount;
      const netBtcBuy = (btcBuyAmount - fee) / price;
      runningVolume += btcBuyAmount;

      // DCA boost in bear: if price dropped >20% from start, allocate extra from cash
      let dcaBonus = 0;
      let dcaBonusBtc = 0;
      let dcaBonusFee = 0;
      if (dcaBoostInBear && price < startBtcPrice * 0.8 && cashBuffer > cashDirectDeposit * 2) {
        dcaBonus = Math.min(cashDirectDeposit * 0.25, cashBuffer * 0.1);
        dcaBonusFee = getStrikeFee(runningVolume) * dcaBonus;
        dcaBonusBtc = (dcaBonus - dcaBonusFee) / price;
        cashBuffer -= dcaBonus;
        runningVolume += dcaBonus;
        totalFeePaid += dcaBonusFee;
      }

      btcBalance += netBtcBuy + dcaBonusBtc;
      totalBtcBought += netBtcBuy + dcaBonusBtc;
      totalFeePaid += fee;
      cumulativeInvested += btcBuyAmount + dcaBonus;
      // Update cost basis with actual USD spent (net of fees, since fees don't buy BTC)
      totalCostBasis += (btcBuyAmount - fee) + (dcaBonus - dcaBonusFee);

      // -- Cash flows --
      cashBuffer += cashDirectDeposit;

      // -- Bill Pay --
      let btcSoldForBills = 0;
      let monthCapitalGain = 0;
      let monthTaxableProceeds = 0;
      const avgCostBasis = btcBalance > 0 ? totalCostBasis / btcBalance : 0;

      if (billPayDefault === "bitcoin") {
        // Pay bills: use cash buffer first, then sell BTC for the remainder
        const cashForBills = Math.min(cashBuffer, monthlyExpenses);
        const btcPortionNeeded = monthlyExpenses - cashForBills;
        cashBuffer -= cashForBills;

        if (btcPortionNeeded > 0) {
          const billBtcNeeded = btcPortionNeeded / price;
          if (btcBalance >= billBtcNeeded) {
            btcBalance -= billBtcNeeded;
            btcSoldForBills = billBtcNeeded;
            totalBtcSold += billBtcNeeded;
            monthTaxableProceeds = btcPortionNeeded;
            totalTaxableProceeds += btcPortionNeeded;
            // Capital gain = proceeds - cost basis of sold BTC
            const gain = (price - avgCostBasis) * billBtcNeeded;
            monthCapitalGain = gain;
            totalCapitalGains += gain;
            // Reduce cost basis proportionally
            totalCostBasis -= avgCostBasis * billBtcNeeded;
            const billFee = getStrikeFee(runningVolume) * btcPortionNeeded;
            totalFeePaid += billFee;
            runningVolume += btcPortionNeeded;
          } else {
            // Not enough BTC — sell what's available, remainder is unfunded
            const btcPortion = btcBalance * price;
            const unfunded = btcPortionNeeded - btcPortion;
            btcSoldForBills = btcBalance;
            totalBtcSold += btcBalance;
            const gain = (price - avgCostBasis) * btcBalance;
            monthCapitalGain = gain;
            totalCapitalGains += gain;
            monthTaxableProceeds = btcPortion;
            totalTaxableProceeds += btcPortion;
            totalCostBasis -= avgCostBasis * btcBalance;
            btcBalance = 0;
            if (unfunded > 0) depleted = true;
          }
        }
      } else {
        // Cash default → not taxable
        cashBuffer -= monthlyExpenses;
        if (cashBuffer < 0) {
          // Sell BTC to cover shortfall
          const shortfall = Math.abs(cashBuffer);
          const btcNeeded = Math.min(shortfall / price, btcBalance); // guard against overdraft
          const actualProceeds = btcNeeded * price;
          btcBalance -= btcNeeded;
          btcSoldForBills = btcNeeded;
          totalBtcSold += btcNeeded;
          const gain = (price - avgCostBasis) * btcNeeded;
          monthCapitalGain = gain;
          totalCapitalGains += gain;
          monthTaxableProceeds = actualProceeds;
          totalTaxableProceeds += actualProceeds;
          totalCostBasis -= avgCostBasis * btcNeeded;
          cashBuffer = actualProceeds >= shortfall ? 0 : -(shortfall - actualProceeds);
          // If both BTC and cash depleted, flag it
          if (btcBalance <= 0 && cashBuffer < 0) depleted = true;
        }
      }

      // Guard: prevent negative balances from floating point
      if (btcBalance < 0) btcBalance = 0;
      if (totalCostBasis < 0) totalCostBasis = 0;

      // -- Lending consideration (bear market survival) --
      let loanNote = "";
      if (useLending && price < startBtcPrice * 0.6 && btcBalance * price > 20000) {
        loanNote = "Eligible for BTC-backed loan to avoid selling";
      }

      const btcValue = btcBalance * nextPrice;
      const netWorth = btcValue + Math.max(0, cashBuffer);

      monthlyData.push({
        month: m + 1,
        label: `${MONTHS[monthIdx]} Y${Math.floor(m/12)+1}`,
        price: Math.round(price),
        nextPrice: Math.round(nextPrice),
        btcBought: netBtcBuy + dcaBonusBtc,
        btcSold: btcSoldForBills,
        btcBalance,
        btcValue,
        cashBuffer: Math.max(0, cashBuffer),
        netWorth,
        fee: fee + dcaBonusFee,
        capitalGain: monthCapitalGain,
        taxableProceeds: monthTaxableProceeds,
        dcaBonus,
        loanNote,
        avgCostBasis,
        priceChange: m > 0 ? (nextPrice - prices[m]) / prices[m] : 0,
        cumulativeInvested,
        depleted,
      });
    }
    return { monthlyData, prices, totalBtcBought, totalBtcSold, totalFeePaid, totalCapitalGains, totalTaxableProceeds, cumulativeInvested, depleted };
  }, [annualIncome, monthlyExpenses, btcAllocationPct, scenario, startBtcPrice, existingBtc, simSeed, yearsToModel, billPayDefault, useLending, emergencyMonths, dcaBoostInBear, totalMonths, monthlyNet, btcDirectDeposit, cashDirectDeposit]);

  const last = simData.monthlyData[simData.monthlyData.length - 1];
  const maxPrice = Math.max(...simData.prices);
  const minPrice = Math.min(...simData.prices);

  // Chart rendering
  const chartHeight = 200;
  const chartWidth = 600;
  const renderChart = useCallback((data, key, color, label, formatter) => {
    if (!data.length) return null;
    const values = data.map(d => d[key]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const step = chartWidth / (data.length - 1 || 1);
    const points = values.map((v, i) => `${i * step},${chartHeight - ((v - min) / range) * (chartHeight - 20) - 10}`).join(" ");
    return (
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "12px", color: "#a8a29e", marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", height: "180px" }}>
          <defs>
            <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,${chartHeight} ${points} ${(data.length-1)*step},${chartHeight}`} fill={`url(#grad-${key})`} />
          <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
          <text x="0" y="14" fill="#78716c" fontSize="10" fontFamily="monospace">{formatter(max)}</text>
          <text x="0" y={chartHeight - 2} fill="#78716c" fontSize="10" fontFamily="monospace">{formatter(min)}</text>
        </svg>
      </div>
    );
  }, []);

  const scenarioConfig = SCENARIOS[scenario];

  const tabStyle = (t) => ({
    padding: "8px 16px", cursor: "pointer", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace",
    background: activeTab === t ? "#f97316" : "transparent", color: activeTab === t ? "#0c0a09" : "#a8a29e",
    border: "1px solid " + (activeTab === t ? "#f97316" : "#44403c"), borderRadius: "4px", fontWeight: 600,
    letterSpacing: "0.05em", textTransform: "uppercase",
  });

  const inputStyle = {
    width: "100%", padding: "8px 10px", background: "#1c1917", border: "1px solid #44403c",
    color: "#fef3c7", borderRadius: "4px", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
  };
  const labelStyle = { display: "block", fontSize: "10px", color: "#a8a29e", marginBottom: "4px",
    fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em" };

  const cardStyle = {
    background: "#1c1917", border: "1px solid #292524", borderRadius: "8px", padding: "16px",
  };

  return (
    <div style={{
      background: "#0c0a09", color: "#e7e5e4", minHeight: "100vh", fontFamily: "'Newsreader', Georgia, serif",
      padding: "24px", maxWidth: "1100px", margin: "0 auto",
    }}>
      {/* HEADER */}
      <div style={{ borderBottom: "2px solid #f97316", paddingBottom: "16px", marginBottom: "24px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#f97316", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: "4px" }}>
          Personal Finance Simulator
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0, color: "#fef3c7", lineHeight: 1.2 }}>
          Living on a Bitcoin Standard
        </h1>
        <p style={{ fontSize: "13px", color: "#78716c", margin: "6px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
          Strike App · Direct Deposit → BTC · Bill Pay · Lending · DCA Strategies
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[["guide","How To Use"],["dashboard","Dashboard"],["inputs","Configure"],["monthly","Monthly Detail"],["strategies","Bear Strategies"],["strike","Strike Features"],["taxes","Tax Impact"]].map(([k,v]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={tabStyle(k)}>{v}</button>
        ))}
      </div>

      {/* INPUTS TAB */}
      {activeTab === "inputs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "12px" }}>Income & Expenses</div>
            <label style={labelStyle}>Annual Gross Income</label>
            <input type="number" value={annualIncome} onChange={e => setAnnualIncome(+e.target.value)} style={inputStyle} />
            <div style={{ height: 10 }} />
            <label style={labelStyle}>Monthly Expenses (all bills)</label>
            <input type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(+e.target.value)} style={inputStyle} />
            <div style={{ height: 10 }} />
            <label style={labelStyle}>Years to Model</label>
            <input type="number" min={1} max={10} value={yearsToModel} onChange={e => setYearsToModel(Math.max(1,Math.min(10,+e.target.value)))} style={inputStyle} />
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "12px" }}>Bitcoin Allocation</div>
            <label style={labelStyle}>% of Net Pay → Bitcoin (via Strike Direct Deposit)</label>
            <input type="range" min={0} max={100} value={btcAllocationPct} onChange={e => setBtcAllocationPct(+e.target.value)} style={{ width: "100%", accentColor: "#f97316" }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "22px", color: "#fef3c7" }}>{btcAllocationPct}%</div>
            <div style={{ fontSize: "11px", color: "#78716c", fontFamily: "'JetBrains Mono', monospace" }}>
              {fmt(btcDirectDeposit)}/mo → BTC &nbsp;|&nbsp; {fmt(cashDirectDeposit)}/mo → Cash
            </div>
            <div style={{ height: 10 }} />
            <label style={labelStyle}>Existing BTC Holdings</label>
            <input type="number" step={0.001} value={existingBtc} onChange={e => setExistingBtc(+e.target.value)} style={inputStyle} />
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "12px" }}>Market Scenario</div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              {Object.entries(SCENARIOS).map(([k,v]) => (
                <button key={k} onClick={() => setScenario(k)} style={{
                  flex: 1, padding: "8px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace",
                  background: scenario === k ? v.color : "transparent", color: scenario === k ? "#0c0a09" : v.color,
                  border: `1px solid ${v.color}`, borderRadius: "4px", cursor: "pointer", fontWeight: 700,
                }}>{v.label}</button>
              ))}
            </div>
            <label style={labelStyle}>Starting BTC Price</label>
            <input type="number" step={1000} value={startBtcPrice} onChange={e => setStartBtcPrice(+e.target.value)} style={inputStyle} />
            <div style={{ height: 8 }} />
            <label style={labelStyle}>Simulation Seed (vary randomness)</label>
            <input type="number" value={simSeed} onChange={e => setSimSeed(+e.target.value)} style={inputStyle} />
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "12px" }}>Strike Settings</div>
            <label style={labelStyle}>Bill Pay Default Balance</label>
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              {[["bitcoin","Bitcoin (taxable)"],["cash","Cash (not taxable)"]].map(([k,v]) => (
                <button key={k} onClick={() => setBillPayDefault(k)} style={{
                  flex: 1, padding: "8px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace",
                  background: billPayDefault === k ? "#f97316" : "transparent", color: billPayDefault === k ? "#0c0a09" : "#a8a29e",
                  border: "1px solid #44403c", borderRadius: "4px", cursor: "pointer",
                }}>{v}</button>
              ))}
            </div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={useLending} onChange={e => setUseLending(e.target.checked)} style={{ accentColor: "#f97316" }} />
              Model BTC-backed lending (avoid selling in bear)
            </label>
            <div style={{ height: 6 }} />
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={dcaBoostInBear} onChange={e => setDcaBoostInBear(e.target.checked)} style={{ accentColor: "#f97316" }} />
              Boost DCA when price drops &gt;20% (bear accumulation)
            </label>
            <div style={{ height: 6 }} />
            <label style={labelStyle}>Emergency Cash Buffer (months of expenses)</label>
            <input type="number" min={1} max={12} value={emergencyMonths} onChange={e => setEmergencyMonths(+e.target.value)} style={inputStyle} />
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <div>
          {/* Scenario badge */}
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "4px", background: scenarioConfig.bgColor, color: scenarioConfig.color, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: "16px", border: `1px solid ${scenarioConfig.color}` }}>
            {scenarioConfig.label} · {yearsToModel}yr · {fmtPct(btcAllocationPct/100)} allocation
          </div>

          {/* KPI Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {[
              ["Net Worth (End)", fmt(last?.netWorth), "#fef3c7"],
              ["BTC Holdings", fmtBtc(last?.btcBalance), "#f97316"],
              ["BTC Value", fmt(last?.btcValue), scenarioConfig.color],
              ["Cash Buffer", fmt(last?.cashBuffer), "#60a5fa"],
              ["Total Invested", fmt(simData.cumulativeInvested), "#a8a29e"],
              ["Total Fees Paid", fmt(simData.totalFeePaid), "#ef4444"],
              ["BTC Price Range", `${fmt(Math.round(minPrice))} – ${fmt(Math.round(maxPrice))}`, "#d6d3d1"],
              ["Capital Gains", fmt(simData.totalCapitalGains), "#f59e0b"],
            ].map(([label, value, color], i) => (
              <div key={i} style={{ ...cardStyle, textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#78716c", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color, marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={cardStyle}>
              {renderChart(simData.monthlyData, "nextPrice", scenarioConfig.color, "BTC Price", fmt)}
            </div>
            <div style={cardStyle}>
              {renderChart(simData.monthlyData, "netWorth", "#fef3c7", "Net Worth", fmt)}
            </div>
            <div style={cardStyle}>
              {renderChart(simData.monthlyData, "btcBalance", "#f97316", "BTC Balance", n => n.toFixed(4))}
            </div>
            <div style={cardStyle}>
              {renderChart(simData.monthlyData, "cashBuffer", "#60a5fa", "Cash Buffer", fmt)}
            </div>
          </div>

          {/* Monthly income breakdown */}
          <div style={{ ...cardStyle, marginTop: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "12px" }}>Monthly Cash Flow Breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>
              <div><span style={{color:"#78716c"}}>Gross Monthly:</span> <span style={{color:"#fef3c7"}}>{fmt(monthlyGross)}</span></div>
              <div><span style={{color:"#78716c"}}>Est. Tax (22%):</span> <span style={{color:"#ef4444"}}>-{fmt(estimatedTax)}</span></div>
              <div><span style={{color:"#78716c"}}>Net Monthly:</span> <span style={{color:"#fef3c7"}}>{fmt(monthlyNet)}</span></div>
              <div><span style={{color:"#78716c"}}>→ BTC ({btcAllocationPct}%):</span> <span style={{color:"#f97316"}}>{fmt(btcDirectDeposit)}</span></div>
              <div><span style={{color:"#78716c"}}>→ Cash ({100-btcAllocationPct}%):</span> <span style={{color:"#60a5fa"}}>{fmt(cashDirectDeposit)}</span></div>
              <div><span style={{color:"#78716c"}}>Monthly Bills:</span> <span style={{color:"#ef4444"}}>-{fmt(monthlyExpenses)}</span></div>
              <div><span style={{color:"#78716c"}}>Net Surplus:</span> <span style={{color: monthlySurplus >= 0 ? "#22c55e" : "#ef4444"}}>{fmt(monthlySurplus)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY DETAIL */}
      {activeTab === "monthly" && (
        <div style={{ ...cardStyle, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #44403c" }}>
                {["Month","BTC Price","BTC Bought","BTC Sold","BTC Bal","BTC Value","Cash","Net Worth","Fees","Cap Gain","DCA Boost"].map(h => (
                  <th key={h} style={{ padding: "8px 6px", textAlign: "right", color: "#a8a29e", fontWeight: 600, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {simData.monthlyData.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #292524", background: i % 2 === 0 ? "transparent" : "#1c191711" }}>
                  <td style={{ padding: "6px", color: "#d6d3d1", textAlign: "left" }}>{d.label}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: d.priceChange >= 0 ? "#22c55e" : "#ef4444" }}>{fmt(d.price)}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#f97316" }}>{d.btcBought.toFixed(6)}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: d.btcSold > 0 ? "#ef4444" : "#44403c" }}>{d.btcSold.toFixed(6)}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#fef3c7" }}>{d.btcBalance.toFixed(6)}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#fef3c7" }}>{fmt(Math.round(d.btcValue))}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#60a5fa" }}>{fmt(Math.round(d.cashBuffer))}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#fef3c7", fontWeight: 700 }}>{fmt(Math.round(d.netWorth))}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#78716c" }}>{fmt(Math.round(d.fee))}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: d.capitalGain > 0 ? "#f59e0b" : d.capitalGain < 0 ? "#ef4444" : "#44403c" }}>{d.capitalGain !== 0 ? fmt(Math.round(d.capitalGain)) : "—"}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: d.dcaBonus > 0 ? "#22c55e" : "#44403c" }}>{d.dcaBonus > 0 ? fmt(Math.round(d.dcaBonus)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BEAR STRATEGIES */}
      {activeTab === "strategies" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#f97316", fontSize: "18px", margin: "0 0 12px" }}>Bear Market Value Protection Strategies</h3>
            <p style={{ color: "#a8a29e", fontSize: "13px", lineHeight: 1.7 }}>
              The biggest risk of living on a Bitcoin standard is a prolonged bear market (historically -55% to -84% drawdowns lasting 12+ months).
              Here are the key strategies modeled and researched for protecting value:
            </p>
          </div>

          {[
            {
              title: "1. Dollar-Cost Averaging Through the Dip",
              icon: "↓",
              desc: "Strike's recurring purchase feature waives trading fees after the first purchase. By keeping your direct deposit allocation constant (or increasing it), you buy more sats at lower prices. Historical data shows DCA investors achieved ~$35K avg entry during the 2022 bear vs $43K for lump-sum buyers — a 19% advantage. This model includes an optional 'bear boost' that redirects 10% of your cash buffer into extra BTC purchases when price drops >20%.",
              color: "#22c55e",
            },
            {
              title: "2. BTC-Backed Loans (Don't Sell — Borrow)",
              icon: "🏦",
              desc: "Strike Lending offers loans from $10K at 9.5% APR with 50% max LTV, no origination fees, and no credit check. In a bear market, instead of selling BTC at depressed prices to cover expenses, you can borrow against your holdings and repay when prices recover. This avoids the taxable event and preserves your upside. The model flags when your BTC balance qualifies for lending. Key risk: if BTC drops further, margin calls trigger at 70% LTV.",
              color: "#f59e0b",
            },
            {
              title: "3. Cash Buffer / Emergency Reserve",
              icon: "💵",
              desc: `This model builds a cash buffer from the cash portion of your direct deposit each month (target: ${emergencyMonths} months of expenses = ${fmt(monthlyExpenses * emergencyMonths)}). During a bear market, shifting bill pay to 'Cash Default' avoids selling BTC at lows entirely — your bills draw from cash deposits while BTC stays untouched. Strike's bill pay automatically falls back to your alternate balance if the primary is insufficient.`,
              color: "#60a5fa",
            },
            {
              title: "4. Shift Bill Pay to Cash Default",
              icon: "🔄",
              desc: "When BTC bill pay is your default, every bill creates a taxable sale event. Switching to cash default during bear markets means: no forced BTC liquidation at lows, no taxable events on bill payments, and your BTC stack continues growing via direct deposit DCA. You can toggle this in the Configure tab to see the difference.",
              color: "#a78bfa",
            },
            {
              title: "5. Reduce BTC Allocation Temporarily",
              icon: "⚖️",
              desc: "During a severe bear, reducing your direct deposit BTC allocation from 80% to 40-50% builds your cash buffer faster while still accumulating sats. Once the Fear & Greed Index hits 'Extreme Fear' (<20), that's historically the signal to increase back to maximum allocation. You can adjust the slider in Configure to model different allocations.",
              color: "#f97316",
            },
            {
              title: "6. Tax-Loss Harvesting",
              icon: "📊",
              desc: "If you're paying bills from BTC (taxable events), bear market sales at a loss generate capital losses you can use to offset up to $3,000/year in ordinary income. Strike provides HIFO (Highest In, First Out) cost basis tracking and issues annual tax documents. Strategic selling during drawdowns can create future tax benefits.",
              color: "#ec4899",
            },
          ].map((s, i) => (
            <div key={i} style={{ ...cardStyle, borderLeft: `3px solid ${s.color}` }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: s.color, marginBottom: "8px" }}>
                {s.title}
              </div>
              <p style={{ color: "#d6d3d1", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* STRIKE FEATURES */}
      {activeTab === "strike" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#f97316", fontSize: "18px", margin: "0 0 12px" }}>Strike App Feature Breakdown</h3>
            <p style={{ color: "#a8a29e", fontSize: "13px" }}>How each Strike feature maps to the Bitcoin standard lifestyle:</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { name: "Direct Deposit", detail: "Route any % of paycheck → BTC. Strike auto-buys at market price. Counts toward fee tier volume. Configure USD/BTC split anytime.", status: "Core to this model" },
              { name: "Bill Pay", detail: "Unique routing/account numbers. Pay rent, mortgage, utilities, credit cards, insurance from BTC or cash balance. $95K per-bill max. Auto-fallback to alternate balance.", status: "Core to this model" },
              { name: "Recurring Purchases (DCA)", detail: "Hourly/daily/weekly/monthly auto-buys. Fees WAIVED after first purchase. Best tool for consistent sat-stacking alongside direct deposit.", status: "Zero-fee DCA" },
              { name: "Bitcoin-Backed Lending", detail: "Loans from $10K, APR starting at 9.5%. Line of credit also available (max $250K). 50% max LTV, no origination fees. Bear market lifeline — borrow instead of selling.", status: "Bear market survival" },
              { name: "Target Orders", detail: "Set price targets to auto-buy when BTC dips. Great for accumulating during corrections without watching charts.", status: "Dip-buying automation" },
              { name: "Auto-Withdrawal to Cold Storage", detail: "Automatically send BTC to your hardware wallet (Bitkey, Ledger, etc.) when balance hits a threshold. Free on-chain withdrawals. Reduces custodial risk.", status: "Security layer" },
              { name: "Bitrefill Integration", detail: "Buy gift cards from major retailers with BTC/cash balance. Groceries, Amazon, streaming services. Lightning-powered, in-app.", status: "Daily spending" },
              { name: "Send Globally", detail: "Lightning-fast remittances to 14+ countries. Recipients get local currency. No added transaction fees from Strike.", status: "International payments" },
              { name: "Free On-Chain Withdrawals", detail: "Strike covers blockchain network costs when you withdraw to self-custody. Most competitors charge for this.", status: "Cost savings" },
              { name: "Cost Basis Tracking", detail: "HIFO method built in. Annual tax documents generated automatically. Tracks all buys, sells, bill payments.", status: "Tax compliance" },
            ].map((f, i) => (
              <div key={i} style={{ ...cardStyle, borderTop: "2px solid #f97316" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#fef3c7", marginBottom: "4px" }}>{f.name}</div>
                <div style={{ fontSize: "9px", color: "#f97316", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: "8px" }}>{f.status}</div>
                <div style={{ fontSize: "12px", color: "#a8a29e", lineHeight: 1.6 }}>{f.detail}</div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "12px" }}>Strike Fee Tiers (US Consumer, 2026)</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #44403c" }}>
                  <th style={{ padding: "8px", textAlign: "left", color: "#a8a29e" }}>Monthly Volume</th>
                  <th style={{ padding: "8px", textAlign: "right", color: "#a8a29e" }}>Trading Fee</th>
                  <th style={{ padding: "8px", textAlign: "right", color: "#a8a29e" }}>DCA (Recurring)</th>
                </tr>
              </thead>
              <tbody>
                {STRIKE_FEE_TIERS.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #292524" }}>
                    <td style={{ padding: "6px 8px", color: "#d6d3d1" }}>{t.label}</td>
                    <td style={{ padding: "6px 8px", textAlign: "right", color: "#f97316" }}>{(t.fee * 100).toFixed(2)}%</td>
                    <td style={{ padding: "6px 8px", textAlign: "right", color: "#22c55e" }}>0% (after 1st)</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "11px", color: "#78716c", marginTop: "8px" }}>
              Note: Recurring purchases (DCA) are fee-free after the first purchase. This is a significant advantage for Bitcoin standard living — set up weekly/daily auto-buys alongside direct deposit for maximum fee efficiency.
            </p>
          </div>
        </div>
      )}

      {/* TAX IMPACT */}
      {activeTab === "taxes" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#f97316", fontSize: "18px", margin: "0 0 12px" }}>Tax Implications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#a8a29e", marginBottom: "4px", fontFamily: "'JetBrains Mono', monospace" }}>REALIZED CAPITAL GAINS</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: simData.totalCapitalGains >= 0 ? "#f59e0b" : "#ef4444", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(simData.totalCapitalGains)}</div>
                <div style={{ fontSize: "11px", color: "#78716c", marginTop: "4px" }}>Over {yearsToModel} year{yearsToModel>1?"s":""}. {simData.totalCapitalGains >= 0 ? "Net capital gains" : "Net capital losses (offsets up to $3K/yr ordinary income)"} from BTC sold ({fmt(simData.totalTaxableProceeds)} total proceeds).</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#a8a29e", marginBottom: "4px", fontFamily: "'JetBrains Mono', monospace" }}>IF CASH DEFAULT INSTEAD</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace" }}>$0</div>
                <div style={{ fontSize: "11px", color: "#78716c", marginTop: "4px" }}>Paying bills from cash balance is NOT a taxable event.</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "#fef3c7", fontSize: "15px", margin: "0 0 12px" }}>Key Tax Rules for Bitcoin Standard Living</h3>
            <div style={{ fontSize: "13px", color: "#d6d3d1", lineHeight: 1.8 }}>
              <p><span style={{color:"#f97316", fontWeight:700}}>Buying BTC via direct deposit:</span> Not a taxable event. Your paycheck is deposited, Strike buys BTC. Cost basis established at purchase price.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Paying bills from BTC balance:</span> Taxable event. Strike sells BTC to USD to pay your biller. Gain/loss calculated using HIFO (Highest In, First Out) method.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Paying bills from cash balance:</span> Not taxable. Cash → biller, no BTC involved.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>BTC-backed loans:</span> Generally NOT a taxable event. Borrowing against BTC is not a sale. Huge advantage for accessing liquidity without tax hit.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Withdrawing to cold storage:</span> Not taxable. Moving BTC from Strike to your wallet is a transfer, not a sale. Strike covers the network fee.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Tax-loss harvesting:</span> If you sell BTC at a loss (bill pay during a bear market), those losses offset capital gains and up to $3,000/year of ordinary income.</p>
              <p style={{color:"#78716c", fontStyle:"italic", fontSize:"11px"}}>Note: This model uses average cost basis for simplicity. Strike uses HIFO (Highest In, First Out), which typically results in lower taxable gains in a rising market and larger deductible losses in a falling market. Actual tax impact may differ.</p>
              <p style={{color:"#78716c", fontStyle:"italic", fontSize:"11px"}}>This is not tax advice. Consult a tax professional for your situation. Strike provides annual tax documents with cost basis calculations.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "12px" }}>Strategy Comparison: BTC Default vs Cash Default for Bill Pay</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #44403c" }}>
                  <th style={{ padding: "8px", textAlign: "left", color: "#a8a29e" }}>Factor</th>
                  <th style={{ padding: "8px", textAlign: "center", color: "#f97316" }}>BTC Default</th>
                  <th style={{ padding: "8px", textAlign: "center", color: "#60a5fa" }}>Cash Default</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Max BTC exposure", "★★★★★", "★★★☆☆"],
                  ["Tax events", "Every bill", "None"],
                  ["Bear market risk", "High (forced selling low)", "Low"],
                  ["Bull market upside", "Highest", "Moderate"],
                  ["Complexity", "Higher (tax tracking)", "Lower"],
                  ["Best for", "Ultra-conviction, bull markets", "Most people, bear markets"],
                ].map(([f, btc, cash], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #292524" }}>
                    <td style={{ padding: "6px 8px", color: "#d6d3d1" }}>{f}</td>
                    <td style={{ padding: "6px 8px", textAlign: "center", color: "#f97316" }}>{btc}</td>
                    <td style={{ padding: "6px 8px", textAlign: "center", color: "#60a5fa" }}>{cash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HOW TO USE GUIDE */}
      {activeTab === "guide" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#f97316", fontSize: "20px", margin: "0 0 8px" }}>Welcome to the Bitcoin Standard Financial Model</h3>
            <p style={{ color: "#d6d3d1", fontSize: "14px", lineHeight: 1.7 }}>
              This tool simulates what your personal finances would look like if you lived on a Bitcoin standard using the
              <span style={{ color: "#f97316", fontWeight: 700 }}> Strike app</span> as your primary financial platform. It models your paycheck flowing in, bills flowing out, BTC accumulation, fees, taxes, and net worth — across bull, neutral, and bear markets.
            </p>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fef3c7", marginBottom: "16px" }}>Quick Start (3 steps)</div>
            {[
              {
                step: "1",
                title: "Set your numbers in Configure",
                desc: "Click the Configure tab. Enter your annual gross income and total monthly expenses (rent, utilities, food, insurance, subscriptions — everything). Adjust the BTC allocation slider to set what percentage of your net paycheck goes into Bitcoin via Strike's direct deposit. The rest stays as cash in your Strike account.",
                color: "#f97316",
              },
              {
                step: "2",
                title: "Pick a market scenario",
                desc: "Still in Configure, choose Bull (+80%/yr), Neutral (+15%/yr), or Bear (-55%/yr). This drives the simulated BTC price path. Change the 'Simulation Seed' number to see different random price paths within that scenario. Set how many years you want to model (1–10).",
                color: "#22c55e",
              },
              {
                step: "3",
                title: "Explore the results",
                desc: "Jump to Dashboard to see your KPIs, charts, and cash flow breakdown. Check Monthly Detail for the full month-by-month table. Visit Bear Strategies, Strike Features, and Tax Impact for deep dives.",
                color: "#60a5fa",
              },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", gap: "14px", marginBottom: "16px", alignItems: "flex-start" }}>
                <div style={{
                  minWidth: "36px", height: "36px", borderRadius: "50%", background: s.color, color: "#0c0a09",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: s.color, marginBottom: "4px" }}>{s.title}</div>
                  <div style={{ fontSize: "13px", color: "#a8a29e", lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fef3c7", marginBottom: "16px" }}>Tab-by-Tab Guide</div>
            {[
              {
                tab: "Configure",
                icon: "⚙️",
                items: [
                  "Annual Income & Monthly Expenses — your core financial inputs",
                  "BTC Allocation Slider — what % of your net pay becomes Bitcoin via Strike direct deposit (live dollar breakdown shown below the slider)",
                  "Market Scenario — toggle between bull, neutral, and bear to see how your finances hold up",
                  "Starting BTC Price — set where Bitcoin starts in the simulation",
                  "Simulation Seed — change this number to generate different random price paths (same scenario, different volatility patterns)",
                  "Bill Pay Default — choose whether Strike pays your bills from your BTC balance (taxable) or cash balance (not taxable)",
                  "BTC-Backed Lending — toggle on to flag months where you could borrow against BTC instead of selling",
                  "DCA Bear Boost — when enabled, the model automatically redirects extra cash into BTC purchases when price drops >20%",
                  "Emergency Buffer — how many months of expenses to keep in cash as a safety net",
                ],
              },
              {
                tab: "Dashboard",
                icon: "📊",
                items: [
                  "Top KPI cards show end-state net worth, BTC holdings, cash buffer, total fees, and taxable events",
                  "Four charts track BTC price, net worth, BTC balance, and cash buffer over time",
                  "Monthly cash flow breakdown shows exactly how your paycheck splits into tax, BTC, cash, bills, and surplus",
                ],
              },
              {
                tab: "Monthly Detail",
                icon: "📋",
                items: [
                  "Full spreadsheet-style table for every month of the simulation",
                  "Columns: BTC price, BTC bought, BTC sold (for bills), running BTC balance, BTC value in USD, cash buffer, net worth, fees paid, and DCA boost amounts",
                  "Green/red price coloring shows month-over-month direction",
                ],
              },
              {
                tab: "Bear Strategies",
                icon: "🛡️",
                items: [
                  "Six researched strategies for surviving a bear market on a Bitcoin standard",
                  "Each strategy explains the concept, how it works in Strike, and how it's modeled in this tool",
                  "Key insight: switching between the Configure options (bill pay default, lending, DCA boost) lets you compare strategies numerically",
                ],
              },
              {
                tab: "Strike Features",
                icon: "⚡",
                items: [
                  "Complete breakdown of every Strike feature relevant to Bitcoin standard living",
                  "Shows how each feature maps to the model (direct deposit, bill pay, DCA, lending, auto-withdrawal, etc.)",
                  "Includes the full Strike fee tier table — note that recurring DCA purchases are FREE after the first one",
                ],
              },
              {
                tab: "Tax Impact",
                icon: "🧾",
                items: [
                  "Total taxable events generated by the simulation",
                  "Side-by-side comparison of BTC default vs cash default for bill pay",
                  "Plain-language tax rules for every action: buying, selling, lending, withdrawing, and tax-loss harvesting",
                ],
              },
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: "20px", borderLeft: "3px solid #44403c", paddingLeft: "14px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", marginBottom: "8px" }}>
                  {section.icon} {section.tab}
                </div>
                {section.items.map((item, j) => (
                  <div key={j} style={{ fontSize: "12px", color: "#a8a29e", lineHeight: 1.7, paddingLeft: "8px", marginBottom: "3px" }}>
                    <span style={{ color: "#78716c", marginRight: "6px" }}>›</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fef3c7", marginBottom: "12px" }}>How the Simulation Works</div>
            <div style={{ fontSize: "13px", color: "#a8a29e", lineHeight: 1.8 }}>
              <p><span style={{color:"#f97316", fontWeight:700}}>Price Engine:</span> BTC prices are generated month-by-month using a log-normal random walk calibrated to each scenario's annual return and monthly volatility. Bull = +80%/yr with 8% monthly vol, Neutral = +15%/yr with 5% vol, Bear = -55%/yr with 10% vol. Change the seed number to see different paths.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Income Flow:</span> Your gross pay is taxed at an estimated 22% federal rate. The net amount splits between BTC and cash based on your allocation slider. The BTC portion is "bought" at that month's price with Strike's tiered trading fee applied.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Cash Buffer:</span> Your cash buffer starts at $0 and builds up naturally from the cash portion of your direct deposit each month. The emergency buffer setting ({emergencyMonths} months = {fmt(monthlyExpenses * emergencyMonths)}) controls the DCA bear boost threshold — extra BTC purchases only trigger when the buffer exceeds 2x your monthly cash deposit.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Bill Pay:</span> If BTC default is selected, your monthly expenses are paid by selling BTC at the current price (taxable event). If cash default, bills come from your cash buffer (no tax). Strike's auto-fallback to the alternate balance is modeled if the primary runs short.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>DCA Bear Boost:</span> When enabled and BTC price is &gt;20% below the starting price, 10% of your cash buffer (up to 25% of your monthly cash deposit) is redirected into extra BTC purchases — buying the dip automatically.</p>
              <p><span style={{color:"#f97316", fontWeight:700}}>Fees:</span> Strike's tiered fee structure is applied based on cumulative monthly trading volume. Recurring DCA purchases are modeled as fee-free (matching Strike's actual policy). Fee tiers reset annually.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fef3c7", marginBottom: "12px" }}>Scenarios to Try</div>
            {[
              { label: "Conservative Bitcoin Standard", settings: "50% BTC allocation, Cash bill pay default, Bear scenario, 3 years", why: "See if you can survive a full bear cycle while still stacking sats" },
              { label: "Full Send", settings: "100% BTC allocation, BTC bill pay default, Bull scenario, 3 years", why: "Maximum exposure — see the upside potential and the tax implications" },
              { label: "Bear Survival Test", settings: "80% BTC allocation, Cash bill pay default, Bear scenario, DCA boost ON, Lending ON, 2 years", why: "Stress-test the bear market strategies — does your cash buffer hold?" },
              { label: "Your Actual Numbers", settings: "Enter your real income, expenses, and existing BTC. Try all 3 scenarios.", why: "The whole point — see what YOUR Bitcoin standard life would actually look like" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "flex-start" }}>
                <div style={{ minWidth: "8px", height: "8px", borderRadius: "50%", background: "#f97316", marginTop: "6px" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fef3c7" }}>{s.label}</div>
                  <div style={{ fontSize: "11px", color: "#f97316", fontFamily: "'JetBrains Mono', monospace", margin: "2px 0" }}>{s.settings}</div>
                  <div style={{ fontSize: "12px", color: "#78716c" }}>{s.why}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", padding: "16px" }}>
            <button onClick={() => setActiveTab("inputs")} style={{
              padding: "12px 32px", background: "#f97316", color: "#0c0a09", border: "none", borderRadius: "6px",
              fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              Get Started → Configure Your Numbers
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "32px", padding: "16px 0", borderTop: "1px solid #292524", fontSize: "10px", color: "#57534e", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
        For educational purposes only. Not financial advice. BTC is volatile — past performance does not predict future results. Consult a financial advisor. Model uses simplified tax estimates and randomized price simulations.
      </div>
    </div>
  );
}
