import { useState, useMemo } from "react";

// ─── Growth Models ───
// Declining CAGR models reflecting Bitcoin's maturing growth curve
const GROWTH_MODELS = {
  conservative: {
    label: "Conservative",
    desc: "Power law floor · ~15% declining CAGR",
    startCAGR: 0.20, endCAGR: 0.08, color: "#64748b",
  },
  moderate: {
    label: "Moderate",
    desc: "ARK bear case · ~30% declining CAGR",
    startCAGR: 0.35, endCAGR: 0.12, color: "#0ea5e9",
  },
  aggressive: {
    label: "Aggressive",
    desc: "ARK base case · ~40% declining CAGR",
    startCAGR: 0.50, endCAGR: 0.18, color: "#f59e0b",
  },
  hyperbitcoinization: {
    label: "Hyper",
    desc: "ARK bull · ~55%+ early CAGR",
    startCAGR: 0.65, endCAGR: 0.22, color: "#f43f5e",
  },
};

function getCAGR(model, year, totalYears) {
  const { startCAGR, endCAGR } = GROWTH_MODELS[model];
  const t = year / totalYears;
  return startCAGR + (endCAGR - startCAGR) * t;
}

// ─── Withdrawal Strategies ───
const WITHDRAWAL_STRATEGIES = {
  traditional: { label: "4% Rule (Sell BTC)", desc: "Sell 4% of BTC annually, adjusted for inflation" },
  lending: { label: "Borrow Against BTC", desc: "Take BTC-backed loans at ~10% APR, never sell" },
  hybrid: { label: "Hybrid", desc: "Borrow in bull years, sell minimum in bear years" },
};

function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return "$0";
  if (Math.abs(n) >= 1e9) return `$${(n/1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n/1e3).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}
function fmtFull(n) {
  if (n === undefined || n === null || isNaN(n)) return "$0";
  return `$${Math.round(n).toLocaleString()}`;
}
function fmtBtc(n) { return n >= 1 ? n.toFixed(4) : n.toFixed(8); }
function fmtPct(n) { return `${(n * 100).toFixed(1)}%`; }

// ─── Main Component ───
export default function BitcoinRetirementPlanner() {
  // Personal
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(45);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  // BTC
  const [currentBtc, setCurrentBtc] = useState(0.05);
  const [monthlyDCA, setMonthlyDCA] = useState(2500);
  const [startPrice, setStartPrice] = useState(85000);
  const [growthModel, setGrowthModel] = useState("moderate");
  // Retirement
  const [annualExpenses, setAnnualExpenses] = useState(60000);
  const [inflationRate, setInflationRate] = useState(0.03);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState("hybrid");
  const [loanAPR, setLoanAPR] = useState(0.10);
  const [capGainsTax, setCapGainsTax] = useState(0.15);
  // UI
  const [tab, setTab] = useState("guide");

  const yearsToRetire = Math.max(1, retireAge - currentAge);
  const retirementYears = Math.max(1, lifeExpectancy - retireAge);
  const totalYears = yearsToRetire + retirementYears;

  // ─── Simulation ───
  const sim = useMemo(() => {
    const accumulation = [];
    const withdrawal = [];
    let btc = currentBtc;
    let price = startPrice;
    let totalInvested = currentBtc * startPrice;
    let annualDCA = monthlyDCA * 12;

    // ACCUMULATION PHASE
    // Track cost basis: total USD spent on BTC (for capital gains calculation)
    let totalCostBasis = currentBtc * startPrice; // initial holdings cost basis
    for (let y = 0; y < yearsToRetire; y++) {
      const cagr = getCAGR(growthModel, y, totalYears);
      const btcBought = annualDCA / price;
      btc += btcBought;
      totalInvested += annualDCA;
      totalCostBasis += annualDCA; // DCA purchases add to cost basis at purchase price
      const newPrice = price * (1 + cagr);
      const portfolioValue = btc * newPrice;
      accumulation.push({
        year: y + 1, age: currentAge + y + 1, price: newPrice, btc, btcBought,
        portfolioValue, totalInvested, cagr, phase: "accumulation",
      });
      price = newPrice;
    }
    // Average cost basis per BTC at retirement
    const avgCostBasisPerBtc = btc > 0 ? totalCostBasis / btc : 0;

    const retirementStartBtc = btc;
    const retirementStartPrice = price;
    const retirementStartValue = btc * price;

    // WITHDRAWAL PHASE
    let expenses = annualExpenses * Math.pow(1 + inflationRate, yearsToRetire);
    let cumulativeLoanDebt = 0;
    let cumulativeTaxPaid = 0;
    let cumulativeSold = 0;
    let depleted = false;
    let depletionAge = null;
    // Carry forward avg cost basis for capital gains calculation
    let costBasisPerBtc = avgCostBasisPerBtc;

    for (let y = 0; y < retirementYears; y++) {
      const cagr = getCAGR(growthModel, yearsToRetire + y, totalYears);
      const newPrice = price * (1 + cagr);
      const portfolioValue = btc * newPrice;
      let btcSold = 0;
      let loanTaken = 0;
      let taxPaid = 0;
      let interestPaid = 0;

      if (!depleted) {
        // Helper: calculate tax on selling BTC (only on gains above cost basis)
        const calcGainsTax = (btcAmount, sellPrice) => {
          const proceeds = btcAmount * sellPrice;
          const basis = btcAmount * costBasisPerBtc;
          const gain = Math.max(0, proceeds - basis);
          return gain * capGainsTax;
        };
        // Helper: how much BTC to sell to net a target USD amount after cap gains tax
        const btcToSellForNet = (targetNet, sellPrice) => {
          // proceeds = btcSold * sellPrice
          // tax = max(0, (sellPrice - costBasisPerBtc) * btcSold) * capGainsTax
          // net = proceeds - tax = btcSold * (sellPrice - max(0, sellPrice - costBasisPerBtc) * capGainsTax)
          const gainPerBtc = Math.max(0, sellPrice - costBasisPerBtc);
          const netPerBtc = sellPrice - gainPerBtc * capGainsTax;
          return netPerBtc > 0 ? targetNet / netPerBtc : Infinity;
        };

        if (withdrawalStrategy === "traditional") {
          // Sell BTC to cover expenses (tax only on gain above cost basis)
          const needed = btcToSellForNet(expenses, newPrice);
          btcSold = Math.min(needed, btc);
          btc -= btcSold;
          taxPaid = calcGainsTax(btcSold, newPrice);
          cumulativeTaxPaid += taxPaid;
          cumulativeSold += btcSold;
        } else if (withdrawalStrategy === "lending") {
          // Borrow against BTC, never sell
          // Max borrow = 50% LTV of holdings at current price
          const maxBorrow = btc * newPrice * 0.5;
          if (maxBorrow >= expenses) {
            loanTaken = expenses;
            interestPaid = cumulativeLoanDebt * loanAPR;
            cumulativeLoanDebt += loanTaken + interestPaid;
          } else {
            // Not enough collateral, must sell some
            const shortfall = expenses - maxBorrow;
            loanTaken = maxBorrow;
            const needed = btcToSellForNet(shortfall, newPrice);
            btcSold = Math.min(needed, btc);
            btc -= btcSold;
            taxPaid = calcGainsTax(btcSold, newPrice);
            cumulativeTaxPaid += taxPaid;
            cumulativeSold += btcSold;
            interestPaid = cumulativeLoanDebt * loanAPR;
            cumulativeLoanDebt += loanTaken + interestPaid;
          }
        } else {
          // Hybrid: borrow when BTC is appreciating well, sell minimum otherwise
          const yearReturn = cagr;
          if (yearReturn > loanAPR && btc * newPrice * 0.4 >= expenses) {
            // Good year: borrow
            loanTaken = expenses;
            interestPaid = cumulativeLoanDebt * loanAPR;
            cumulativeLoanDebt += loanTaken + interestPaid;
          } else {
            // Sell BTC (tax only on gain)
            const needed = btcToSellForNet(expenses, newPrice);
            btcSold = Math.min(needed, btc);
            btc -= btcSold;
            taxPaid = calcGainsTax(btcSold, newPrice);
            cumulativeTaxPaid += taxPaid;
            cumulativeSold += btcSold;
          }
        }

        if (btc <= 0.00001) {
          depleted = true;
          depletionAge = retireAge + y + 1;
          btc = 0;
        }
      }

      expenses *= (1 + inflationRate);
      price = newPrice;

      withdrawal.push({
        year: yearsToRetire + y + 1, age: retireAge + y + 1, price: newPrice,
        btc, btcSold, loanTaken, taxPaid, interestPaid,
        portfolioValue: btc * newPrice, expenses: expenses / (1 + inflationRate),
        cumulativeLoanDebt, cumulativeTaxPaid, cagr, phase: "withdrawal", depleted,
      });
    }

    const finalBtc = btc;
    const finalPrice = price;
    const finalValue = btc * price;
    const allYears = [...accumulation, ...withdrawal];

    return {
      accumulation, withdrawal, allYears, retirementStartBtc, retirementStartPrice,
      retirementStartValue, finalBtc, finalPrice, finalValue, totalInvested,
      cumulativeLoanDebt, cumulativeTaxPaid, cumulativeSold, depleted, depletionAge,
    };
  }, [currentAge, retireAge, lifeExpectancy, currentBtc, monthlyDCA, startPrice,
      growthModel, annualExpenses, inflationRate, withdrawalStrategy, loanAPR,
      capGainsTax, yearsToRetire, retirementYears, totalYears]);

  // Chart
  const renderAreaChart = (data, key, color, label, format) => {
    if (!data.length) return null;
    const W = 580, H = 160;
    const vals = data.map(d => d[key]);
    const max = Math.max(...vals, 1);
    const min = Math.min(...vals, 0);
    const range = max - min || 1;
    const step = W / (data.length - 1 || 1);
    const pts = vals.map((v, i) => `${i*step},${H - ((v-min)/range)*(H-24)-12}`).join(" ");
    // Find retirement boundary
    const retireIdx = data.findIndex(d => d.phase === "withdrawal");
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, fontFamily: "monospace", letterSpacing: "0.05em" }}>{label}</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 140 }}>
          <defs>
            <linearGradient id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {retireIdx > 0 && (
            <rect x={retireIdx * step} y="0" width={W - retireIdx * step} height={H} fill="#0f172a" opacity="0.5" />
          )}
          <polygon points={`0,${H} ${pts} ${(data.length-1)*step},${H}`} fill={`url(#g-${key})`} />
          <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
          {retireIdx > 0 && (
            <line x1={retireIdx * step} y1="0" x2={retireIdx * step} y2={H} stroke="#475569" strokeWidth="1" strokeDasharray="4,3" />
          )}
          <text x="4" y="12" fill="#64748b" fontSize="9" fontFamily="monospace">{format(max)}</text>
          <text x="4" y={H-2} fill="#64748b" fontSize="9" fontFamily="monospace">{format(min)}</text>
          {retireIdx > 0 && (
            <text x={retireIdx * step + 4} y="12" fill="#475569" fontSize="8" fontFamily="monospace">RETIRE</text>
          )}
        </svg>
      </div>
    );
  };

  const successColor = sim.depleted ? "#ef4444" : "#10b981";
  const successText = sim.depleted ? `Stack depletes at age ${sim.depletionAge}` : "Stack survives through life expectancy";

  const card = { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 18 };
  const mono = { fontFamily: "'IBM Plex Mono', 'Courier New', monospace" };
  const tabBtn = (t) => ({
    padding: "7px 14px", cursor: "pointer", fontSize: 11, ...mono,
    background: tab === t ? "#e2e8f0" : "transparent", color: tab === t ? "#0f172a" : "#64748b",
    border: `1px solid ${tab === t ? "#e2e8f0" : "#334155"}`, borderRadius: 3, fontWeight: 600,
    letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.15s",
  });
  const input = {
    width: "100%", padding: "7px 9px", background: "#1e293b", border: "1px solid #334155",
    color: "#e2e8f0", borderRadius: 4, fontSize: 13, ...mono, outline: "none",
  };
  const lbl = { display: "block", fontSize: 9, color: "#64748b", marginBottom: 3, ...mono,
    textTransform: "uppercase", letterSpacing: "0.12em" };

  return (
    <div style={{
      background: "#020617", color: "#cbd5e1", minHeight: "100vh",
      fontFamily: "'Crimson Pro', 'Georgia', serif", padding: 24, maxWidth: 1050, margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #1e293b", paddingBottom: 16 }}>
        <div>
          <div style={{ fontSize: 9, ...mono, letterSpacing: "0.25em", color: "#475569", textTransform: "uppercase", marginBottom: 2 }}>Bitcoin · Financial Independence</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            Retirement Planner
          </h1>
        </div>
        <div style={{ ...mono, fontSize: 11, color: "#475569", textAlign: "right" }}>
          <div>Strike DCA + Lending</div>
          <div>Accumulate → Withdraw</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {[["guide","How To Use"],["config","Configure"],["overview","Overview"],["accumulation","Accumulation"],["retirement","Retirement"],["yearly","Year-by-Year"],["compare","Compare Models"]].map(([k,v]) => (
          <button key={k} onClick={() => setTab(k)} style={tabBtn(k)}>{v}</button>
        ))}
      </div>

      {/* ═══════ HOW TO USE ═══════ */}
      {tab === "guide" && (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={card}>
            <h3 style={{ color: "#e2e8f0", fontSize: 20, margin: "0 0 10px", fontWeight: 700 }}>Welcome to the Bitcoin Retirement Planner</h3>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8 }}>
              This tool models two phases of a Bitcoin-based retirement: <strong style={{ color: "#0ea5e9" }}>Accumulation</strong> (stacking sats via Strike DCA until your target retirement age) and <strong style={{ color: "#f59e0b" }}>Withdrawal</strong> (funding your lifestyle from your BTC stack for the rest of your life). It accounts for declining BTC growth rates, inflation, taxes, and BTC-backed lending as an alternative to selling.
            </p>
          </div>

          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Quick Start</div>
            {[
              { n: "1", title: "Configure your profile", desc: "Go to the Configure tab. Set your current age, target retirement age, life expectancy, current BTC holdings, and how much you DCA per month. The starting BTC price defaults to ~$85K.", c: "#0ea5e9" },
              { n: "2", title: "Choose a growth model", desc: "Pick Conservative (power law floor, ~15-20% declining CAGR), Moderate (ARK bear case, ~30-35%), Aggressive (ARK base case, ~40-50%), or Hyper (ARK bull, ~55-65% early). All models use a declining CAGR — BTC growth slows as it matures.", c: "#f59e0b" },
              { n: "3", title: "Set retirement spending", desc: "Enter your desired annual expenses in today's dollars, inflation rate, capital gains tax rate, and pick a withdrawal strategy: 4% rule (sell BTC), Borrow Against BTC (Strike Lending, never sell), or Hybrid (borrow in good years, sell in slow years).", c: "#10b981" },
              { n: "4", title: "Explore results", desc: "Overview shows if your plan succeeds or fails. Accumulation and Retirement tabs break down each phase. Year-by-Year is the full table. Compare Models runs all four growth scenarios side by side.", c: "#f43f5e" },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div style={{ minWidth: 32, height: 32, borderRadius: "50%", border: `2px solid ${s.c}`, color: s.c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, ...mono }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.c, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>Tab Guide</div>
            {[
              { tab: "Configure", items: ["Age inputs (current, retirement target, life expectancy)", "BTC holdings and monthly DCA amount", "Growth model selector with declining CAGR explanation", "Retirement expenses, inflation, tax rate, withdrawal strategy", "Strike Lending APR for borrow-against-BTC strategies"] },
              { tab: "Overview", items: ["Success/failure banner — does your stack survive?", "KPI cards for retirement start value, final value, total invested, taxes, loan debt", "Full-timeline charts for BTC price, portfolio value, and BTC holdings with retirement line marked"] },
              { tab: "Accumulation", items: ["Charts and stats for the stacking phase only", "Shows total BTC accumulated, cost basis, and portfolio value at retirement", "Monthly DCA contribution breakdown"] },
              { tab: "Retirement", items: ["Withdrawal phase breakdown by strategy", "Shows how each year's expenses are funded (selling vs borrowing)", "Loan debt accumulation for lending strategies", "Depletion warning if stack runs out"] },
              { tab: "Year-by-Year", items: ["Full table for every year from now to life expectancy", "Color-coded accumulation vs withdrawal phases", "Columns: age, BTC price, BTC held, portfolio value, expenses, BTC sold, loans, taxes"] },
              { tab: "Compare Models", items: ["Runs all 4 growth models with your current settings", "Side-by-side KPI comparison: retirement value, final value, survival status", "Quickly see which scenarios your plan works under"] },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 14, paddingLeft: 14, borderLeft: "2px solid #1e293b" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>{s.tab}</div>
                {s.items.map((item, j) => (
                  <div key={j} style={{ fontSize: 11, color: "#64748b", lineHeight: 1.7 }}>
                    <span style={{ color: "#334155", marginRight: 6 }}>—</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Key Concepts</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.9 }}>
              <p><strong style={{ color: "#0ea5e9" }}>Declining CAGR:</strong> Unlike simple compound growth, this model reduces BTC's annual growth rate each year. BTC grew 200%+ annually in its early years but as it matures and market cap grows, returns naturally compress. ARK Invest projects a baseline ~40% CAGR through 2030, declining further after.</p>
              <p><strong style={{ color: "#f59e0b" }}>4% Rule for BTC:</strong> The traditional Trinity Study says you can withdraw 4% of a portfolio annually and not run out over 30 years. For BTC, this is conservative in bull scenarios but risky in bear scenarios due to higher volatility. The model adjusts withdrawals for inflation each year.</p>
              <p><strong style={{ color: "#10b981" }}>Borrow, Don't Sell:</strong> Strike Lending lets you borrow USD against BTC at ~9.5-13% APR with no credit check. If BTC's growth rate exceeds your loan APR, you come out ahead AND avoid capital gains tax. The Hybrid strategy automatically switches between borrowing and selling based on whether that year's growth exceeds the loan rate.</p>
              <p><strong style={{ color: "#f43f5e" }}>Tax Advantage of Lending:</strong> Selling BTC = taxable event (capital gains). Borrowing against BTC = generally not taxable. Over 30+ years of retirement, this difference can be worth hundreds of thousands of dollars.</p>
            </div>
          </div>

          <div style={{ textAlign: "center", padding: 16 }}>
            <button onClick={() => setTab("config")} style={{
              padding: "11px 28px", background: "#e2e8f0", color: "#0f172a", border: "none", borderRadius: 4,
              fontSize: 13, fontWeight: 700, cursor: "pointer", ...mono, letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              Get Started → Configure
            </button>
          </div>
        </div>
      )}

      {/* ═══════ CONFIG ═══════ */}
      {tab === "config" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>You</div>
            <label style={lbl}>Current Age</label>
            <input type="number" value={currentAge} onChange={e => setCurrentAge(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>Target Retirement Age</label>
            <input type="number" value={retireAge} onChange={e => setRetireAge(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>Life Expectancy</label>
            <input type="number" value={lifeExpectancy} onChange={e => setLifeExpectancy(+e.target.value)} style={input} />
            <div style={{ ...mono, fontSize: 11, color: "#475569", marginTop: 8 }}>
              {yearsToRetire}yr accumulation → {retirementYears}yr withdrawal
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>Bitcoin Stack</div>
            <label style={lbl}>Current BTC Holdings</label>
            <input type="number" step={0.01} value={currentBtc} onChange={e => setCurrentBtc(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>Monthly DCA Amount (USD)</label>
            <input type="number" step={100} value={monthlyDCA} onChange={e => setMonthlyDCA(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>Starting BTC Price</label>
            <input type="number" step={1000} value={startPrice} onChange={e => setStartPrice(+e.target.value)} style={input} />
            <div style={{ ...mono, fontSize: 11, color: "#475569", marginTop: 8 }}>
              {fmtFull(monthlyDCA * 12)}/yr DCA · {fmtFull(monthlyDCA * 12 * yearsToRetire)} total
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>Growth Model</div>
            {Object.entries(GROWTH_MODELS).map(([k, v]) => (
              <button key={k} onClick={() => setGrowthModel(k)} style={{
                display: "block", width: "100%", padding: "8px 10px", marginBottom: 6, textAlign: "left",
                background: growthModel === k ? v.color + "22" : "transparent",
                border: `1px solid ${growthModel === k ? v.color : "#1e293b"}`, borderRadius: 4, cursor: "pointer",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: growthModel === k ? v.color : "#94a3b8", ...mono }}>{v.label}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{v.desc}</div>
              </button>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>Retirement</div>
            <label style={lbl}>Annual Expenses (today's $)</label>
            <input type="number" step={1000} value={annualExpenses} onChange={e => setAnnualExpenses(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>Inflation Rate</label>
            <input type="number" step={0.005} value={inflationRate} onChange={e => setInflationRate(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>Capital Gains Tax Rate</label>
            <input type="number" step={0.01} value={capGainsTax} onChange={e => setCapGainsTax(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>BTC Loan APR (Strike Lending)</label>
            <input type="number" step={0.005} value={loanAPR} onChange={e => setLoanAPR(+e.target.value)} style={input} />
            <div style={{ height: 8 }} />
            <label style={lbl}>Withdrawal Strategy</label>
            {Object.entries(WITHDRAWAL_STRATEGIES).map(([k, v]) => (
              <button key={k} onClick={() => setWithdrawalStrategy(k)} style={{
                display: "block", width: "100%", padding: "7px 9px", marginBottom: 4, textAlign: "left",
                background: withdrawalStrategy === k ? "#1e293b" : "transparent",
                border: `1px solid ${withdrawalStrategy === k ? "#475569" : "#1e293b"}`, borderRadius: 4, cursor: "pointer",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: withdrawalStrategy === k ? "#e2e8f0" : "#64748b", ...mono }}>{v.label}</div>
                <div style={{ fontSize: 9, color: "#475569" }}>{v.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ OVERVIEW ═══════ */}
      {tab === "overview" && (
        <div style={{ display: "grid", gap: 14 }}>
          {/* Status Banner */}
          <div style={{ ...card, borderLeft: `4px solid ${successColor}`, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 32 }}>{sim.depleted ? "⚠️" : "✓"}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: successColor }}>{successText}</div>
              <div style={{ fontSize: 12, color: "#64748b", ...mono }}>
                {GROWTH_MODELS[growthModel].label} model · {WITHDRAWAL_STRATEGIES[withdrawalStrategy].label} strategy · Retire at {retireAge}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
            {[
              ["At Retirement", fmt(sim.retirementStartValue), "#0ea5e9"],
              ["BTC at Retire", fmtBtc(sim.retirementStartBtc), "#f59e0b"],
              ["BTC Price at Retire", fmt(sim.retirementStartPrice), "#94a3b8"],
              ["Total DCA Invested", fmt(sim.totalInvested), "#64748b"],
              ["Final Portfolio", fmt(sim.finalValue), successColor],
              ["Final BTC Held", fmtBtc(sim.finalBtc), "#f59e0b"],
              ["Final BTC Price", fmt(sim.finalPrice), "#94a3b8"],
              ["Total Tax Paid", fmt(sim.cumulativeTaxPaid), "#ef4444"],
              ["Loan Debt (EOL)", fmt(sim.cumulativeLoanDebt), "#f43f5e"],
              ["BTC Sold Total", fmtBtc(sim.cumulativeSold), "#fb923c"],
            ].map(([l, v, c], i) => (
              <div key={i} style={{ ...card, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#475569", ...mono, textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, marginTop: 4, ...mono }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={card}>
              {renderAreaChart(sim.allYears, "price", "#0ea5e9", "BTC PRICE PROJECTION", fmt)}
            </div>
            <div style={card}>
              {renderAreaChart(sim.allYears, "portfolioValue", "#f59e0b", "PORTFOLIO VALUE", fmt)}
            </div>
          </div>
          <div style={card}>
            {renderAreaChart(sim.allYears, "btc", "#10b981", "BTC HOLDINGS (accumulation → withdrawal)", n => n.toFixed(4))}
          </div>
        </div>
      )}

      {/* ═══════ ACCUMULATION ═══════ */}
      {tab === "accumulation" && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={card}>
            <h3 style={{ color: "#0ea5e9", fontSize: 18, margin: "0 0 8px" }}>Accumulation Phase: Age {currentAge} → {retireAge}</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
              DCA {fmtFull(monthlyDCA)}/month into BTC via Strike direct deposit for {yearsToRetire} years.
              Starting with {fmtBtc(currentBtc)} BTC at {fmtFull(startPrice)}/BTC.
              Strike's recurring purchase fees are waived after the first purchase.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {[
              ["Total DCA Invested", fmt(sim.totalInvested), "#64748b"],
              ["BTC Accumulated", fmtBtc(sim.retirementStartBtc), "#f59e0b"],
              ["Portfolio at Retire", fmt(sim.retirementStartValue), "#0ea5e9"],
              ["ROI", fmtPct((sim.retirementStartValue - sim.totalInvested) / sim.totalInvested), "#10b981"],
              ["BTC Price at Retire", fmt(sim.retirementStartPrice), "#94a3b8"],
              ["Avg Cost Basis", fmt(sim.totalInvested / sim.retirementStartBtc), "#f59e0b"],
            ].map(([l,v,c], i) => (
              <div key={i} style={{ ...card, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#475569", ...mono, textTransform: "uppercase" }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, marginTop: 4, ...mono }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={card}>
            {renderAreaChart(sim.accumulation, "portfolioValue", "#0ea5e9", "PORTFOLIO GROWTH DURING ACCUMULATION", fmt)}
            {renderAreaChart(sim.accumulation, "btc", "#f59e0b", "BTC STACK GROWING", n => n.toFixed(4))}
          </div>
        </div>
      )}

      {/* ═══════ RETIREMENT ═══════ */}
      {tab === "retirement" && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={card}>
            <h3 style={{ color: "#f59e0b", fontSize: 18, margin: "0 0 8px" }}>Withdrawal Phase: Age {retireAge} → {lifeExpectancy}</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
              Strategy: <strong style={{ color: "#e2e8f0" }}>{WITHDRAWAL_STRATEGIES[withdrawalStrategy].label}</strong>.
              Starting with {fmtBtc(sim.retirementStartBtc)} BTC ({fmt(sim.retirementStartValue)}).
              Annual expenses: {fmtFull(annualExpenses)} (today's dollars), growing at {fmtPct(inflationRate)}/yr inflation.
            </p>
          </div>

          <div style={{ ...card, borderLeft: `4px solid ${successColor}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: successColor, marginBottom: 6 }}>{successText}</div>
            {withdrawalStrategy !== "traditional" && (
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                <strong style={{ color: "#e2e8f0" }}>Lending strategy note:</strong> Cumulative loan debt at end of life: {fmt(sim.cumulativeLoanDebt)}.
                Your heirs would need to repay this from your remaining BTC stack ({fmtBtc(sim.finalBtc)} BTC worth {fmt(sim.finalValue)}).
                {sim.finalValue > sim.cumulativeLoanDebt ?
                  ` Net estate value: ${fmt(sim.finalValue - sim.cumulativeLoanDebt)}.` :
                  ` Warning: loan debt exceeds portfolio value.`}
              </div>
            )}
            {withdrawalStrategy === "traditional" && (
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                Total capital gains tax paid: {fmt(sim.cumulativeTaxPaid)} over {retirementYears} years.
                Total BTC sold: {fmtBtc(sim.cumulativeSold)}.
              </div>
            )}
          </div>

          <div style={card}>
            {renderAreaChart(sim.withdrawal, "portfolioValue", "#f59e0b", "PORTFOLIO VALUE DURING RETIREMENT", fmt)}
            {renderAreaChart(sim.withdrawal, "btc", "#10b981", "BTC HOLDINGS DURING RETIREMENT", n => n.toFixed(4))}
            {sim.withdrawal.some(d => d.cumulativeLoanDebt > 0) && renderAreaChart(sim.withdrawal, "cumulativeLoanDebt", "#f43f5e", "CUMULATIVE LOAN DEBT", fmt)}
          </div>
        </div>
      )}

      {/* ═══════ YEAR-BY-YEAR ═══════ */}
      {tab === "yearly" && (
        <div style={{ ...card, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, ...mono }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #1e293b" }}>
                {["Age","Phase","BTC Price","BTC Held","Value","DCA/Expense","BTC Sold","Loan","Tax","CAGR"].map(h => (
                  <th key={h} style={{ padding: "7px 5px", textAlign: "right", color: "#475569", fontWeight: 600, fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sim.allYears.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #0f172a", background: d.phase === "withdrawal" ? "#0c0f1a" : "transparent" }}>
                  <td style={{ padding: "5px", textAlign: "right", color: "#e2e8f0" }}>{d.age}</td>
                  <td style={{ padding: "5px", textAlign: "right", color: d.phase === "accumulation" ? "#0ea5e9" : "#f59e0b", fontSize: 8 }}>
                    {d.phase === "accumulation" ? "STACK" : "SPEND"}
                  </td>
                  <td style={{ padding: "5px", textAlign: "right", color: "#94a3b8" }}>{fmt(d.price)}</td>
                  <td style={{ padding: "5px", textAlign: "right", color: "#f59e0b" }}>{d.btc.toFixed(4)}</td>
                  <td style={{ padding: "5px", textAlign: "right", color: "#e2e8f0", fontWeight: 600 }}>{fmt(d.portfolioValue)}</td>
                  <td style={{ padding: "5px", textAlign: "right", color: d.phase === "accumulation" ? "#10b981" : "#fb923c" }}>
                    {d.phase === "accumulation" ? fmt(monthlyDCA * 12) : fmt(d.expenses)}
                  </td>
                  <td style={{ padding: "5px", textAlign: "right", color: d.btcSold > 0.0001 ? "#ef4444" : "#1e293b" }}>
                    {d.btcSold > 0.0001 ? d.btcSold.toFixed(4) : "—"}
                  </td>
                  <td style={{ padding: "5px", textAlign: "right", color: d.loanTaken > 0 ? "#f43f5e" : "#1e293b" }}>
                    {d.loanTaken > 0 ? fmt(d.loanTaken) : "—"}
                  </td>
                  <td style={{ padding: "5px", textAlign: "right", color: d.taxPaid > 0 ? "#ef4444" : "#1e293b" }}>
                    {d.taxPaid > 0 ? fmt(d.taxPaid) : "—"}
                  </td>
                  <td style={{ padding: "5px", textAlign: "right", color: "#64748b" }}>{fmtPct(d.cagr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══════ COMPARE MODELS ═══════ */}
      {tab === "compare" && (() => {
        const results = Object.entries(GROWTH_MODELS).map(([model, config]) => {
          let btc = currentBtc;
          let price = startPrice;
          let totalInv = currentBtc * startPrice;
          let costBasis = currentBtc * startPrice;
          for (let y = 0; y < yearsToRetire; y++) {
            const dcaAmt = monthlyDCA * 12;
            btc += dcaAmt / price;
            totalInv += dcaAmt;
            costBasis += dcaAmt;
            price *= (1 + getCAGR(model, y, totalYears));
          }
          const retVal = btc * price;
          const avgBasis = btc > 0 ? costBasis / btc : 0;
          // Withdrawal sim with proper capital gains tax
          let expenses = annualExpenses * Math.pow(1 + inflationRate, yearsToRetire);
          let dep = false;
          let depAge = null;
          for (let y = 0; y < retirementYears; y++) {
            price *= (1 + getCAGR(model, yearsToRetire + y, totalYears));
            // Calculate BTC to sell: need enough after cap gains tax to cover expenses
            const gainPerBtc = Math.max(0, price - avgBasis);
            const netPerBtc = price - gainPerBtc * capGainsTax;
            const sell = netPerBtc > 0 ? expenses / netPerBtc : btc;
            btc -= Math.min(sell, btc);
            if (btc <= 0.00001) { dep = true; depAge = retireAge + y + 1; btc = 0; break; }
            expenses *= (1 + inflationRate);
          }
          return { model, config, retVal, finalVal: btc * price, finalBtc: btc, finalPrice: price, totalInv, depleted: dep, depAge };
        });
        return (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={card}>
              <h3 style={{ color: "#e2e8f0", fontSize: 18, margin: "0 0 8px" }}>Model Comparison (4% Sell Strategy)</h3>
              <p style={{ color: "#64748b", fontSize: 12, ...mono }}>
                Same inputs, different growth assumptions. Using simple sell strategy for apples-to-apples.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {results.map(r => (
                <div key={r.model} style={{ ...card, borderTop: `3px solid ${r.config.color}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: r.config.color, marginBottom: 2, ...mono }}>{r.config.label}</div>
                  <div style={{ fontSize: 9, color: "#475569", marginBottom: 12 }}>{r.config.desc}</div>
                  {[
                    ["At Retirement", fmt(r.retVal)],
                    ["Final Portfolio", fmt(r.finalVal)],
                    ["Final BTC", fmtBtc(r.finalBtc)],
                    ["Final Price", fmt(r.finalPrice)],
                    ["Total Invested", fmt(r.totalInv)],
                    ["ROI at Retire", fmtPct((r.retVal - r.totalInv) / r.totalInv)],
                  ].map(([l,v], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, ...mono }}>
                      <span style={{ color: "#64748b" }}>{l}</span>
                      <span style={{ color: "#e2e8f0" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, padding: "6px 8px", borderRadius: 4, textAlign: "center", fontSize: 11, fontWeight: 700, ...mono,
                    background: r.depleted ? "#7f1d1d" : "#052e16", color: r.depleted ? "#fca5a5" : "#6ee7b7",
                    border: `1px solid ${r.depleted ? "#ef4444" : "#10b981"}`,
                  }}>
                    {r.depleted ? `Depletes at age ${r.depAge}` : "Survives ✓"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Footer */}
      <div style={{ marginTop: 32, padding: "14px 0", borderTop: "1px solid #1e293b", fontSize: 9, color: "#334155", ...mono, textAlign: "center" }}>
        For educational purposes only. Not financial advice. BTC is volatile and past performance does not predict future results. Growth models use declining CAGR estimates informed by ARK Invest and power law research. Consult a financial advisor.
      </div>
    </div>
  );
}
