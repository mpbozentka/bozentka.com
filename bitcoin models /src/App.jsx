import { useState } from "react";
import BitcoinStandardModel from "../bitcoin-standard-financial-model.jsx";
import BitcoinRetirementPlanner from "../bitcoin-retirement-planner.jsx";

export default function App() {
  const [activeTool, setActiveTool] = useState("standard");

  const navStyle = (key) => ({
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    background: activeTool === key ? "#f97316" : "transparent",
    color: activeTool === key ? "#0c0a09" : "#a8a29e",
    border: `1px solid ${activeTool === key ? "#f97316" : "#44403c"}`,
    borderRadius: "6px",
    letterSpacing: "0.05em",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0c0a09" }}>
      <div
        style={{
          display: "flex",
          gap: "12px",
          padding: "16px 24px",
          borderBottom: "1px solid #292524",
          background: "#0c0a09",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTool("standard")}
          style={navStyle("standard")}
        >
          Bitcoin Standard Model
        </button>
        <button
          onClick={() => setActiveTool("retirement")}
          style={navStyle("retirement")}
        >
          Retirement Planner
        </button>
      </div>
      <div>
        {activeTool === "standard" && <BitcoinStandardModel />}
        {activeTool === "retirement" && <BitcoinRetirementPlanner />}
      </div>
    </div>
  );
}
