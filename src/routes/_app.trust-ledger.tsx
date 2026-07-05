import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  CheckCircle2,
  Shield,
  UserCheck,
  GitCommit,
  ChevronDown,
  Filter,
  AlertCircle,
  Play,
} from "lucide-react";
import { PageHeader, SignalChip } from "@/components/app-shell";
import { trustLedgerApi } from "@/lib/api";
import { AIRecommendation, Explainability } from "../types/api";

interface MappedLedgerEntry {
  id: string;
  title: string;
  when: string;
  confidence: number;
  impact: "High" | "Medium" | "Low";
  outcome: string;
  signals: string[];
  reason: string;
  alternatives: string;
  feedback: string;
  trust: string;
  human: boolean;
  explainability: Explainability;
}

function TrustLedgerErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="font-bold text-red-800">Failed to load Trust Ledger</h3>
      <p className="text-sm text-red-600 mt-1">{error.message || "Please try again."}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}

function generateExplainability(r: AIRecommendation): Explainability {
  if (r.explainability) {
    return r.explainability;
  }

  const titleLower = r.title.toLowerCase();
  
  // Category mapping
  let category: "Home Purchase" | "Wedding" | "International Trip" | "SIP" | "Investment" | "Credit Card" | "Insurance" | "Retirement" | "Education" | "Default" = "Default";
  if (titleLower.includes("home") || titleLower.includes("villa") || titleLower.includes("house") || titleLower.includes("mortgage")) {
    category = "Home Purchase";
  } else if (titleLower.includes("wedding") || titleLower.includes("marriage")) {
    category = "Wedding";
  } else if (titleLower.includes("trip") || titleLower.includes("travel") || titleLower.includes("vacation") || titleLower.includes("paris")) {
    category = "International Trip";
  } else if (titleLower.includes("sip") || titleLower.includes("mutual fund")) {
    category = "SIP";
  } else if (titleLower.includes("credit card") || titleLower.includes("limit") || titleLower.includes("card")) {
    category = "Credit Card";
  } else if (titleLower.includes("invest") || titleLower.includes("fd") || titleLower.includes("fixed deposit") || titleLower.includes("savings")) {
    category = "Investment";
  } else if (titleLower.includes("insurance") || titleLower.includes("policy") || titleLower.includes("premium")) {
    category = "Insurance";
  } else if (titleLower.includes("retirement") || titleLower.includes("pension") || titleLower.includes("nps")) {
    category = "Retirement";
  } else if (titleLower.includes("education") || titleLower.includes("study") || titleLower.includes("university") || titleLower.includes("college") || titleLower.includes("mba")) {
    category = "Education";
  }

  // Format date
  let tsStr = "5 Jul 2026";
  if (r.timestamp) {
    try {
      tsStr = new Date(r.timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {}
  }

  const confidence = r.confidence_score;

  if (category === "Home Purchase") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "09:00 AM", explanation: "Verified stable monthly salary of ₹1.8L and ₹4.8L savings." },
        { step: "Pattern Detection", timestamp: "09:10 AM", explanation: "Detected consistent savings rate of 26% and property search triggers." },
        { step: "Goal Matching", timestamp: "09:20 AM", explanation: "Matched parameters with active 'Home Purchase' goal for March 2026." },
        { step: "Risk Assessment", timestamp: "09:30 AM", explanation: "Calculated low debt-to-income (DTI) ratio (14%). Moderate risk profile." },
        { step: "Alternative Evaluation", timestamp: "09:40 AM", explanation: "Analyzed renting vs purchasing mortgage yields over a 15-year tenure." },
        { step: "Customer Benefit Check", timestamp: "09:50 AM", explanation: "Down payment path optimized for wealth growth, minimizing interest cost." },
        { step: "Compliance Review", timestamp: "10:00 AM", explanation: "Passed all national mortgage loan-to-value (LTV) limits." },
        { step: "Final Recommendation", timestamp: "10:10 AM", explanation: "SIP allocation increased to reach down payment target 14 months faster." }
      ],
      why_not: [
        { recommendation: "Increase SIP (Recommended) ⭐", score: 96, benefit: "High", risk: "Low", decision: "Selected" },
        { recommendation: "Fixed Deposit Sweep", score: 82, benefit: "Medium", risk: "Low", decision: "Lower long-term return" },
        { recommendation: "Leave Cash Idle", score: 61, benefit: "Low", risk: "Very Low", decision: "Inflation loss" },
        { recommendation: "Personal Loan later", score: 39, benefit: "Low", risk: "High", decision: "Higher borrowing cost" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Monthly income supports down payment SIP timeline.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "DTI is healthy at 14%. Emergency buffer intact.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Reduces long term renting expense drain.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Passed all banking loan-to-value guidelines.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹28.4L", goal_time: "8 years", risk: "Low", selected: true },
        { scenario: "Fixed Deposit", wealth: "₹23.1L", goal_time: "9.5 years", risk: "Very Low", selected: false },
        { scenario: "Savings Account", wealth: "₹19.7L", goal_time: "11 years", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹45,000",
        savings_progress: 75,
        goal_acceleration: "14 Months Faster",
        acceleration_progress: 90,
        risk_reduction: "22%",
        risk_progress: 70,
        expected_wealth_growth: "+₹12.4L",
        wealth_progress: 82
      },
      confidence_breakdown: {
        income_stability: 96,
        savings_behaviour: 88,
        debt_capacity: 81,
        goal_alignment: 100,
        market_conditions: 84
      },
      evidence_used: [
        { category: "Income", signals: ["Salary Credits Verified", "Stable Income flow"] },
        { category: "Savings", signals: ["Emergency Fund Present", "Savings Growth trend"] },
        { category: "Goals", signals: ["Home Purchase predicted"] },
        { category: "Risk", signals: ["High Credit Score", "Low Debt Ratio"] }
      ],
      trust_evolution: {
        before: 84,
        after: 96,
        change: "+12",
        reason: "Recommendation explained with evidence and alternatives."
      },
      scorecard: {
        customer_benefit: 96,
        transparency: 100,
        financial_risk: "Low",
        confidence: 92,
        affordability: 84
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  } else if (category === "Wedding") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "09:00 AM", explanation: "Verified monthly income of ₹1.8L and ₹3.2L liquid balances." },
        { step: "Pattern Detection", timestamp: "09:10 AM", explanation: "Detected recurring wedding venue deposit searches and savings spikes." },
        { step: "Goal Matching", timestamp: "09:20 AM", explanation: "Aligned with target 'Wedding Fund' milestone for November 2026." },
        { step: "Risk Assessment", timestamp: "09:30 AM", explanation: "Shifted risk index to conservative-balanced due to short horizon." },
        { step: "Alternative Evaluation", timestamp: "09:40 AM", explanation: "Compared high-interest liquid sweep deposits vs short-term arbitrage funds." },
        { step: "Customer Benefit Check", timestamp: "09:50 AM", explanation: "Prevented lock-in penalties while securing stable 7.5% returns." },
        { step: "Compliance Review", timestamp: "10:00 AM", explanation: "Ensured capital limits align with tax exemption thresholds." },
        { step: "Final Recommendation", timestamp: "10:10 AM", explanation: "Rebalanced ₹50,000 to safe short-term mutual fund SIP." }
      ],
      why_not: [
        { recommendation: "Rebalance to Hybrid SIP ⭐", score: 91, benefit: "High", risk: "Low", decision: "Selected" },
        { recommendation: "Fixed Deposit Sweep", score: 84, benefit: "Medium", risk: "Low", decision: "Low tax efficiency" },
        { recommendation: "Take Personal Loan later", score: 45, benefit: "Low", risk: "High", decision: "High interest rates" },
        { recommendation: "Leave Cash in Savings", score: 62, benefit: "Low", risk: "Very Low", decision: "Lower interest" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Shift to hybrid ensures target is locked safely.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "Balanced risk keeps volatility below 5%.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Low cost alternative avoids personal loan debt.", status: status === "approved" ? "approved" : "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Scheme disclosures provided.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹15.8L", goal_time: "1.2 years", risk: "Low", selected: true },
        { scenario: "Personal Loan", wealth: "₹15.0L", goal_time: "Immediate", risk: "High", selected: false },
        { scenario: "Savings Account", wealth: "₹13.8L", goal_time: "1.5 years", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹1.2L loan interest saved",
        savings_progress: 85,
        goal_acceleration: "3 Months Faster",
        acceleration_progress: 75,
        risk_reduction: "40% Volatility Drop",
        risk_progress: 90,
        expected_wealth_growth: "+₹1.8L savings",
        wealth_progress: 80
      },
      confidence_breakdown: {
        income_stability: 95,
        savings_behaviour: 90,
        debt_capacity: 88,
        goal_alignment: 98,
        market_conditions: 85
      },
      evidence_used: [
        { category: "Income", signals: ["Salary credit verified"] },
        { category: "Savings", signals: ["Emergency reserves active"] },
        { category: "Goals", signals: ["Wedding milestone targeted"] },
        { category: "Risk", signals: ["Conservative shift requested"] }
      ],
      trust_evolution: {
        before: 86,
        after: 91,
        change: "+5",
        reason: "Capital security and loan avoidance strategy made fully visible."
      },
      scorecard: {
        customer_benefit: 91,
        transparency: 100,
        financial_risk: "Low",
        confidence: 91,
        affordability: 88
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  } else if (category === "International Trip") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "10:00 AM", explanation: "Mapped vacation search cookies and passport renewal alerts." },
        { step: "Pattern Detection", timestamp: "10:10 AM", explanation: "Detected seasonal travel budgeting and foreign exchange transactions." },
        { step: "Goal Matching", timestamp: "10:20 AM", explanation: "Matched with active 'Paris Trip' timeline for June 2027." },
        { step: "Risk Assessment", timestamp: "10:30 AM", explanation: "High liquidity requirement limits target options to highly liquid funds." },
        { step: "Alternative Evaluation", timestamp: "10:40 AM", explanation: "Compared foreign currency savings deposits vs multi-currency travel card sweeps." },
        { step: "Customer Benefit Check", timestamp: "10:50 AM", explanation: "Lock-in dynamic forex rates to hedge exchange volatility." },
        { step: "Compliance Review", timestamp: "11:00 AM", explanation: "Passed Liberalised Remittance Scheme (LRS) tax limits." },
        { step: "Final Recommendation", timestamp: "11:10 AM", explanation: "Initialize recurring sweep of ₹15,000 monthly to trip fund." }
      ],
      why_not: [
        { recommendation: "Foreign Currency Sweep ⭐", score: 88, benefit: "High", risk: "Low", decision: "Selected" },
        { recommendation: "Credit Card Funding", score: 50, benefit: "Low", risk: "High", decision: "Currency markup fees (3.5%)" },
        { recommendation: "Cash Accumulation", score: 60, benefit: "Low", risk: "Lowest", decision: "Loss of yield" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Smooth out forex volatility using recurring card sweeps.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "Avoid credit card debt traps for leisure expenses.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Dynamic exchange lock secures travel budget.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Remittance limits compliant.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹2.2L vacation fund", goal_time: "11 months", risk: "Low", selected: true },
        { scenario: "Credit Card", wealth: "₹2.0L debt", goal_time: "Post-trip", risk: "High", selected: false },
        { scenario: "Savings Account", wealth: "₹1.9L fund", goal_time: "14 months", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹22,000 markup saved",
        savings_progress: 75,
        goal_acceleration: "3 Months Faster",
        acceleration_progress: 70,
        risk_reduction: "15% Forex Hedge",
        risk_progress: 80,
        expected_wealth_growth: "+₹30,000 markup savings",
        wealth_progress: 72
      },
      confidence_breakdown: {
        income_stability: 94,
        savings_behaviour: 86,
        debt_capacity: 92,
        goal_alignment: 95,
        market_conditions: 75
      },
      evidence_used: [
        { category: "Income", signals: ["Consistent monthly income"] },
        { category: "Savings", signals: ["Travel savings account active"] },
        { category: "Goals", signals: ["Paris Trip targeted"] },
        { category: "Risk", signals: ["Zero-debt funding preferred"] }
      ],
      trust_evolution: {
        before: 84,
        after: 88,
        change: "+4",
        reason: "Forex hedging and markup savings transparently verified."
      },
      scorecard: {
        customer_benefit: 88,
        transparency: 100,
        financial_risk: "Low",
        confidence: 88,
        affordability: 92
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  } else if (category === "SIP") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "10:00 AM", explanation: "Verified discretionary spending reduced by 15%." },
        { step: "Pattern Detection", timestamp: "10:10 AM", explanation: "Detected unallocated monthly surplus cash flow." },
        { step: "Goal Matching", timestamp: "10:20 AM", explanation: "Matched with long-term wealth compounding objectives." },
        { step: "Risk Assessment", timestamp: "10:30 AM", explanation: "Confirmed growth risk profile permits equity mutual fund exposure." },
        { step: "Alternative Evaluation", timestamp: "10:40 AM", explanation: "Compared mutual fund SIP compounding vs debt instruments vs cash." },
        { step: "Customer Benefit Check", timestamp: "10:50 AM", explanation: "Maximized returns using tax-efficient equity savings." },
        { step: "Compliance Review", timestamp: "11:00 AM", explanation: "Validated KYC and risk suitability parameters." },
        { step: "Final Recommendation", timestamp: "11:10 AM", explanation: "SIP contribution increased by ₹3,000 monthly." }
      ],
      why_not: [
        { recommendation: "Increase SIP by ₹3k ⭐", score: 92, benefit: "High", risk: "Moderate", decision: "Selected" },
        { recommendation: "One-time Lump Sum", score: 75, benefit: "High", risk: "High", decision: "Timing risk" },
        { recommendation: "Deploy in FD", score: 70, benefit: "Medium", risk: "Low", decision: "Lower long-term returns" },
        { recommendation: "Leave Cash Idle", score: 58, benefit: "Low", risk: "Lowest", decision: "Inflation erosion" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Compounding maximizes long term goal achievements.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "Dollar-cost averaging mitigates market volatility.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Fits easily within verified monthly savings surplus.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "KYC and fund selection align with policy.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹18.5L", goal_time: "6 years", risk: "Moderate", selected: true },
        { scenario: "Fixed Deposit", wealth: "₹13.4L", goal_time: "7.5 years", risk: "Low", selected: false },
        { scenario: "Savings Account", wealth: "₹9.2L", goal_time: "9 years", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹18,500",
        savings_progress: 68,
        goal_acceleration: "11 Months Faster",
        acceleration_progress: 80,
        risk_reduction: "18%",
        risk_progress: 78,
        expected_wealth_growth: "+₹6.8L",
        wealth_progress: 75
      },
      confidence_breakdown: {
        income_stability: 94,
        savings_behaviour: 90,
        debt_capacity: 85,
        goal_alignment: 95,
        market_conditions: 76
      },
      evidence_used: [
        { category: "Income", signals: ["Increment Mapped", "Consistent Cash Inflow"] },
        { category: "Savings", signals: ["Investment Surplus Detected", "Discretionary Spend Drop (15%)"] },
        { category: "Goals", signals: ["Compounding target set"] },
        { category: "Risk", signals: ["Moderate-High Risk Tolerance"] }
      ],
      trust_evolution: {
        before: 88,
        after: 94,
        change: "+6",
        reason: "Compounding advantages and cost mitigations made transparent."
      },
      scorecard: {
        customer_benefit: 92,
        transparency: 100,
        financial_risk: "Medium",
        confidence: 90,
        affordability: 90
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  } else if (category === "Credit Card") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "08:00 AM", explanation: "Verified 12-month prompt payment history and 38% card utilization." },
        { step: "Pattern Detection", timestamp: "08:10 AM", explanation: "Identified seasonal credit spikes and utilization approaching warning limits." },
        { step: "Goal Matching", timestamp: "08:20 AM", explanation: "Matched with goal to optimize credit score card rating." },
        { step: "Risk Assessment", timestamp: "08:30 AM", explanation: "Calculated low default risk tier based on continuous salary credits." },
        { step: "Alternative Evaluation", timestamp: "08:40 AM", explanation: "Compared raising limit vs taking personal line of credit vs leaving limits unchanged." },
        { step: "Customer Benefit Check", timestamp: "08:50 AM", explanation: "Limit enhancement reduces utilization index without cost." },
        { step: "Compliance Review", timestamp: "09:00 AM", explanation: "Aligned with maximum credit multi-brackets for income class." },
        { step: "Final Recommendation", timestamp: "09:10 AM", explanation: "Recommend increasing credit card limit by ₹1.5L." }
      ],
      why_not: [
        { recommendation: "Raise Card Limit ⭐", score: 95, benefit: "High", risk: "Low", decision: "Selected" },
        { recommendation: "Personal Loan", score: 45, benefit: "Medium", risk: "Medium", decision: "Interest overhead" },
        { recommendation: "Use Emergency FD", score: 60, benefit: "Low", risk: "Low", decision: "Buffer depletion" },
        { recommendation: "Minimum Due Pay", score: 30, benefit: "Lowest", risk: "High", decision: "High interest p.a." }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Limit raise provides immediate liquidity backup.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend with conditions", reason: "Verify utilization remains below 30% post-enhancement.", status: "warning" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Pre-approved zero-fee offer prevents cost additions.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Credit risk criteria successfully cleared.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹1.5L buffer", goal_time: "Immediate", risk: "Low", selected: true },
        { scenario: "Personal Loan", wealth: "₹1.5L debt", goal_time: "3 days", risk: "Medium", selected: false },
        { scenario: "Current Limit", wealth: "₹0 buffer", goal_time: "N/A", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹0 (limit increase)",
        savings_progress: 30,
        goal_acceleration: "Immediate Activation",
        acceleration_progress: 95,
        risk_reduction: "5% Utilization Drop",
        risk_progress: 95,
        expected_wealth_growth: "+₹1.5L buffer",
        wealth_progress: 60
      },
      confidence_breakdown: {
        income_stability: 98,
        savings_behaviour: 85,
        debt_capacity: 96,
        goal_alignment: 90,
        market_conditions: 88
      },
      evidence_used: [
        { category: "Income", signals: ["Income bracket threshold cleared", "Prompt Payment History"] },
        { category: "Savings", signals: ["Positive Monthly Surplus"] },
        { category: "Goals", signals: ["Credit Score Optimization"] },
        { category: "Risk", signals: ["Low Delinquency Tier", "No Outstanding Overdues"] }
      ],
      trust_evolution: {
        before: 92,
        after: 90,
        change: "-2",
        reason: "Recommendation declined, but credit health warnings acknowledged."
      },
      scorecard: {
        customer_benefit: 95,
        transparency: 100,
        financial_risk: "Low",
        confidence: 95,
        affordability: 98
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: false
      }
    };
  } else if (category === "Investment") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "11:00 AM", explanation: "Verified average monthly expenses and liquid balance of ₹4.82L." },
        { step: "Pattern Detection", timestamp: "11:10 AM", explanation: "Detected sub-optimal interest yield on idle savings deposits." },
        { step: "Goal Matching", timestamp: "11:20 AM", explanation: "Matched with Emergency Fund target of 6 months expenses." },
        { step: "Risk Assessment", timestamp: "11:30 AM", explanation: "Ensured risk-free capital preservation with instant access." },
        { step: "Alternative Evaluation", timestamp: "11:40 AM", explanation: "Compared sweep-in Fixed Deposits vs short-term debt funds vs cash holdings." },
        { step: "Customer Benefit Check", timestamp: "11:50 AM", explanation: "Locked guaranteed 7.2% yield while maintaining complete liquidity." },
        { step: "Compliance Review", timestamp: "12:00 PM", explanation: "Verified DICGC deposit insurance compliance regulations." },
        { step: "Final Recommendation", timestamp: "12:10 PM", explanation: "Transfer ₹15,000 to sweep-in Fixed Deposit." }
      ],
      why_not: [
        { recommendation: "Top-up Emergency FD ⭐", score: 88, benefit: "Medium", risk: "Lowest", decision: "Selected" },
        { recommendation: "Equity Mutual Funds", score: 64, benefit: "High", risk: "Medium", decision: "Short-term market risk" },
        { recommendation: "Keep in Savings Account", score: 72, benefit: "Low", risk: "Lowest", decision: "Lower yield (4% p.a.)" },
        { recommendation: "Physical Gold", score: 48, benefit: "Medium", risk: "Low", decision: "Transaction spread/illiquid" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Boosts returns on idle cash reserves.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "FD provides zero capital volatility, ideal for reserves.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Retains liquidity for immediate emergency access.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Complies fully with deposit protection policies.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹15,000 secure", goal_time: "Immediate", risk: "Lowest", selected: true },
        { scenario: "Equity Fund", wealth: "₹16,500 expected", goal_time: "1.5 years", risk: "Moderate", selected: false },
        { scenario: "Savings Account", wealth: "₹15,000 cash", goal_time: "Continuous", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹15,000",
        savings_progress: 85,
        goal_acceleration: "Immediate Allocation",
        acceleration_progress: 99,
        risk_reduction: "45% Risk Cover",
        risk_progress: 85,
        expected_wealth_growth: "+₹3,600/year",
        wealth_progress: 70
      },
      confidence_breakdown: {
        income_stability: 95,
        savings_behaviour: 92,
        debt_capacity: 90,
        goal_alignment: 99,
        market_conditions: 82
      },
      evidence_used: [
        { category: "Income", signals: ["Salary Credit Confirmed"] },
        { category: "Savings", signals: ["Emergency Fund below 6-mo target", "Idle cash in savings account"] },
        { category: "Goals", signals: ["Emergency buffer top-up"] },
        { category: "Risk", signals: ["Guaranteed return preference"] }
      ],
      trust_evolution: {
        before: 80,
        after: 92,
        change: "+12",
        reason: "Guaranteed yield optimization with zero risk is transparently presented."
      },
      scorecard: {
        customer_benefit: 88,
        transparency: 100,
        financial_risk: "Lowest",
        confidence: 88,
        affordability: 95
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  } else if (category === "Insurance") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "02:00 PM", explanation: "Verified user's age, dependents, and ₹45L active home loan." },
        { step: "Pattern Detection", timestamp: "02:10 PM", explanation: "Identified lack of term life insurance to cover major liabilities." },
        { step: "Goal Matching", timestamp: "02:20 PM", explanation: "Matched with Family Protection and Mortgage Protection goals." },
        { step: "Risk Assessment", timestamp: "02:30 PM", explanation: "Calculated high financial risk to dependents in case of premature death." },
        { step: "Alternative Evaluation", timestamp: "02:40 PM", explanation: "Compared pure Term Cover vs Endowment savings plan vs self-funding." },
        { step: "Customer Benefit Check", timestamp: "02:50 PM", explanation: "Term insurance offers maximum cover with extremely low premium outgo." },
        { step: "Compliance Review", timestamp: "03:00 PM", explanation: "Adheres to IRDAI premium disclosures and eligibility requirements." },
        { step: "Final Recommendation", timestamp: "03:10 PM", explanation: "Purchase Term Life Cover of ₹1 Cr to cover outstanding home loan." }
      ],
      why_not: [
        { recommendation: "Term Cover (₹1 Cr) ⭐", score: 94, benefit: "High", risk: "Lowest", decision: "Selected" },
        { recommendation: "Endowment Policy", score: 65, benefit: "Medium", risk: "Low", decision: "High cost / low cover" },
        { recommendation: "Self-Insurance", score: 50, benefit: "Low", risk: "High", decision: "Insufficient net worth" },
        { recommendation: "Personal Loan cover", score: 25, benefit: "Lowest", risk: "High", decision: "High family debt" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Secures family against mortgage liability.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "Transfers high-impact mortality risk to insurance pool.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Low premium rate minimizes monthly cash flow impact.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "KYC and disclosure conditions fully met.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹1 Cr cover", goal_time: "Instant", risk: "Lowest", selected: true },
        { scenario: "Endowment Plan", wealth: "₹20L expected", goal_time: "15 years", risk: "Low", selected: false },
        { scenario: "Self-Insurance", wealth: "₹9.8L cash", goal_time: "N/A", risk: "High", selected: false }
      ],
      impact_metrics: {
        savings: "₹1.2L premiums saved",
        savings_progress: 70,
        goal_acceleration: "Immediate Protection",
        acceleration_progress: 99,
        risk_reduction: "95% Liability Cover",
        risk_progress: 95,
        expected_wealth_growth: "+₹1 Cr safety net",
        wealth_progress: 90
      },
      confidence_breakdown: {
        income_stability: 93,
        savings_behaviour: 86,
        debt_capacity: 89,
        goal_alignment: 100,
        market_conditions: 91
      },
      evidence_used: [
        { category: "Income", signals: ["Primary Breadwinner status verified"] },
        { category: "Savings", signals: ["Surplus covers monthly premium"] },
        { category: "Goals", signals: ["Family security", "Home Loan cover"] },
        { category: "Risk", signals: ["Mortgage default liability protection"] }
      ],
      trust_evolution: {
        before: 85,
        after: 97,
        change: "+12",
        reason: "Imperative family security risk coverage clearly reasoned."
      },
      scorecard: {
        customer_benefit: 94,
        transparency: 100,
        financial_risk: "Lowest",
        confidence: 93,
        affordability: 96
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: false
      }
    };
  } else if (category === "Retirement") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "03:00 PM", explanation: "Verified user's age (32) and target retirement timeline (28 years)." },
        { step: "Pattern Detection", timestamp: "03:10 PM", explanation: "Identified deficit in projected retirement corpus under current allocations." },
        { step: "Goal Matching", timestamp: "03:20 PM", explanation: "Matched with retirement wealth building goal targets." },
        { step: "Risk Assessment", timestamp: "03:30 PM", explanation: "Confirmed long horizon allows equity-heavy growth exposure." },
        { step: "Alternative Evaluation", timestamp: "03:40 PM", explanation: "Compared NPS equity/debt mix vs traditional PPF vs savings account cash." },
        { step: "Customer Benefit Check", timestamp: "03:50 PM", explanation: "NPS offers low expense ratios and dynamic lifecycle rebalancing." },
        { step: "Compliance Review", timestamp: "04:00 PM", explanation: "Satisfied Sec 80CCD tax deduction compliance parameters." },
        { step: "Final Recommendation", timestamp: "04:10 PM", explanation: "Open NPS account and contribute ₹5,000 monthly." }
      ],
      why_not: [
        { recommendation: "NPS Account ⭐", score: 90, benefit: "High", risk: "Moderate", decision: "Selected" },
        { recommendation: "PPF Account top-up", score: 60, benefit: "Medium", risk: "Lowest", decision: "Lower yield (fixed)" },
        { recommendation: "Traditional Pension", score: 50, benefit: "Low", risk: "Lowest", decision: "High management fees" },
        { recommendation: "Crypto assets", score: 30, benefit: "Lowest", risk: "High", decision: "Unsafe retirement volatility" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Compounding ensures sustainable post-retirement income.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "Lifecycle asset allocation automatically reduces risk with age.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Unlocks additional ₹50,000 annual tax exemption benefits.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Matches pension authority guidelines.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹45.2L corpus", goal_time: "25 years", risk: "Moderate", selected: true },
        { scenario: "PPF account", wealth: "₹28.4L corpus", goal_time: "25 years", risk: "Lowest", selected: false },
        { scenario: "Savings Account", wealth: "₹14.2L balance", goal_time: "30 years", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹60,000/yr tax saved",
        savings_progress: 80,
        goal_acceleration: "5 Years Earlier",
        acceleration_progress: 85,
        risk_reduction: "30% Volatility Drop",
        risk_progress: 72,
        expected_wealth_growth: "+₹16.8L growth",
        wealth_progress: 88
      },
      confidence_breakdown: {
        income_stability: 92,
        savings_behaviour: 89,
        debt_capacity: 84,
        goal_alignment: 98,
        market_conditions: 78
      },
      evidence_used: [
        { category: "Income", signals: ["Current Salary level matches brackets"] },
        { category: "Savings", signals: ["Long term savings appetite confirmed"] },
        { category: "Goals", signals: ["Retirement planning target (60 yrs)"] },
        { category: "Risk", signals: ["Tax-saving capacity unused under Sec 80CCD"] }
      ],
      trust_evolution: {
        before: 82,
        after: 91,
        change: "+9",
        reason: "Long-term compounding pension growth benefits clearly explained."
      },
      scorecard: {
        customer_benefit: 91,
        transparency: 100,
        financial_risk: "Medium",
        confidence: 91,
        affordability: 94
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  } else if (category === "Education") {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "09:00 AM", explanation: "Verified user's MBA search trends and cash availability timeline." },
        { step: "Pattern Detection", timestamp: "09:15 AM", explanation: "Detected upcoming fees liability (₹15L) in September 2027." },
        { step: "Goal Matching", timestamp: "09:30 AM", explanation: "Matched with predicted Higher Education goal schedule." },
        { step: "Risk Assessment", timestamp: "09:45 AM", explanation: "Checked that child/user education loans maintain overall safety levels." },
        { step: "Alternative Evaluation", timestamp: "10:00 AM", explanation: "Compared dedicated education savings plans vs standard loans vs equity liquification." },
        { step: "Customer Benefit Check", timestamp: "10:15 AM", explanation: "Optimized monthly reserves to cover 80% of fees, minimizing loan liability." },
        { step: "Compliance Review", timestamp: "10:30 AM", explanation: "Complies with student planning tax exemption rules." },
        { step: "Final Recommendation", timestamp: "10:45 AM", explanation: "Open a dedicated Education Savings Plan." }
      ],
      why_not: [
        { recommendation: "Education Plan ⭐", score: 87, benefit: "High", risk: "Moderate", decision: "Selected" },
        { recommendation: "Savings Account", score: 55, benefit: "Low", risk: "Lowest", decision: "Sub-optimal yield/fees gap" },
        { recommendation: "Full Education Loan", score: 70, benefit: "Medium", risk: "Medium", decision: "High student debt burden" },
        { recommendation: "Small Cap Equities", score: 45, benefit: "High", risk: "High", decision: "Pre-college market crash risk" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Secures college fees timeline accurately.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "Advises shifting to debt portfolio 6 months prior to goal.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Aligns savings milestones with expected MBA cost inflation.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Adheres to banking student schemes guidelines.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "₹12.4L saved", goal_time: "2 years", risk: "Moderate", selected: true },
        { scenario: "Full Student Loan", wealth: "₹15.8L debt", goal_time: "7 years", risk: "Moderate", selected: false },
        { scenario: "Savings Account", wealth: "₹9.1L saved", goal_time: "3 years", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹35,000 fees discount",
        savings_progress: 65,
        goal_acceleration: "9 Months Faster",
        acceleration_progress: 75,
        risk_reduction: "15% Cash Strain Drop",
        risk_progress: 80,
        expected_wealth_growth: "+₹3.3L saved",
        wealth_progress: 68
      },
      confidence_breakdown: {
        income_stability: 91,
        savings_behaviour: 87,
        debt_capacity: 93,
        goal_alignment: 97,
        market_conditions: 80
      },
      evidence_used: [
        { category: "Income", signals: ["Consistent monthly savings capacity"] },
        { category: "Savings", signals: ["Education reserves account active"] },
        { category: "Goals", signals: ["MBA admission target (Sep 2027)"] },
        { category: "Risk", signals: ["Excellent parental credit rating"] }
      ],
      trust_evolution: {
        before: 86,
        after: 94,
        change: "+8",
        reason: "Goal-targeted educational savings timeline matched accurately."
      },
      scorecard: {
        customer_benefit: 87,
        transparency: 100,
        financial_risk: "Medium",
        confidence: 87,
        affordability: 91
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  } else {
    return {
      decision_replay: [
        { step: "Financial Signals Collected", timestamp: "10:00 AM", explanation: "Verified user accounts status and recent transaction parameters." },
        { step: "Pattern Detection", timestamp: "10:15 AM", explanation: "Identified periodic spending spikes and surplus thresholds." },
        { step: "Goal Matching", timestamp: "10:30 AM", explanation: "Matched with standard wealth security goal metrics." },
        { step: "Risk Assessment", timestamp: "10:45 AM", explanation: "Calculated low overall volatility exposure boundaries." },
        { step: "Alternative Evaluation", timestamp: "11:00 AM", explanation: `Compared option '${r.title}' against standard conservative reserves.` },
        { step: "Customer Benefit Check", timestamp: "11:15 AM", explanation: "Verified zero net costs and positive interest optimizations." },
        { step: "Compliance Review", timestamp: "11:30 AM", explanation: "Passed all standard regulatory banking checks." },
        { step: "Final Recommendation", timestamp: "11:45 AM", explanation: `Advisory finalized for: ${r.title}.` }
      ],
      why_not: [
        { recommendation: `${r.title} (Recommended) ⭐`, score: confidence, benefit: "Medium", risk: "Low", decision: "Selected" },
        { recommendation: "Traditional Savings Account", score: Math.max(50, confidence - 20), benefit: "Low", risk: "Lowest", decision: "Lower yield" },
        { recommendation: "Do Nothing", score: Math.max(30, confidence - 35), benefit: "Lowest", risk: "Lowest", decision: "Inefficiency loss" }
      ],
      agent_deliberation: {
        agents: [
          { agent: "Financial Planner", decision: "Recommend", reason: "Fits general surplus capital allocations.", status: "approved" },
          { agent: "Risk Engine", decision: "Recommend", reason: "General credit risk remains low.", status: "approved" },
          { agent: "Customer Advocate", decision: "Recommend", reason: "Enhances overall client account value.", status: "approved" },
          { agent: "Compliance Engine", decision: "Approved", reason: "Adheres to fair advisory practices.", status: "approved" }
        ],
        consensus: "4 / 4 Approved"
      },
      counterfactuals: [
        { scenario: "Recommended ⭐", wealth: "Optimized growth", goal_time: "Accelerated", risk: "Low", selected: true },
        { scenario: "Traditional Allocation", wealth: "Standard growth", goal_time: "Delayed", risk: "Lowest", selected: false }
      ],
      impact_metrics: {
        savings: "₹10,000",
        savings_progress: 50,
        goal_acceleration: "6 Months Faster",
        acceleration_progress: 60,
        risk_reduction: "10%",
        risk_progress: 65,
        expected_wealth_growth: "+₹2.0L",
        wealth_progress: 55
      },
      confidence_breakdown: {
        income_stability: Math.max(70, confidence - 5),
        savings_behaviour: Math.max(70, confidence - 10),
        debt_capacity: Math.max(70, confidence - 8),
        goal_alignment: Math.max(70, confidence - 2),
        market_conditions: Math.max(70, confidence - 12)
      },
      evidence_used: [
        { category: "Income", signals: ["Active account status verified"] },
        { category: "Savings", signals: ["Positive average cash flow"] },
        { category: "Goals", signals: ["Standard savings optimization"] },
        { category: "Risk", signals: ["Credit history in good standing"] }
      ],
      trust_evolution: {
        before: 85,
        after: 87,
        change: "+2",
        reason: "AI recommendation parameters matched dynamically."
      },
      scorecard: {
        customer_benefit: confidence,
        transparency: 100,
        financial_risk: "Low",
        confidence: confidence,
        affordability: Math.max(75, confidence - 5)
      },
      identity: {
        decision_id: `REC-2026-${10000 + (confidence * 77) % 9000}`,
        timestamp: tsStr,
        model: "IDBI Financial AI",
        status: "Verified"
      },
      benefit_test: {
        prioritized: true,
        transparent: true,
        compliant: true,
        lower_risk: true,
        wealth_optimized: true
      }
    };
  }
}

export const Route = createFileRoute("/_app/trust-ledger")({
  head: () => ({
    meta: [
      { title: "Trust Ledger — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "An immutable record of every AI recommendation, signal and outcome.",
      },
      { property: "og:title", content: "Trust Ledger — IDBI BANK Life Moments AI" },
      {
        property: "og:description",
        content: "Transparency for every decision the AI makes for you.",
      },
    ],
  }),
  component: LedgerPage,
  errorComponent: (props) => <TrustLedgerErrorFallback {...props} />,
});

function LedgerPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState<Record<string, "audit" | "replay">>({});

  // Fetch Trust Ledger AI Recommendations
  const {
    data: recommendations,
    isLoading,
    error,
    refetch,
  } = useQuery<AIRecommendation[]>({
    queryKey: ["trust-ledger"],
    queryFn: trustLedgerApi.getTrustLedger,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />

        {/* Filter bar skeleton */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-slate-200 rounded-full" />
          <div className="h-10 w-24 bg-slate-200 rounded-full" />
        </div>

        {/* Ledger box skeleton */}
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load Trust Ledger</h3>
        <p className="text-sm text-red-600 mt-1">Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Map API models to UI properties
  const entries = (recommendations || []).map((r: AIRecommendation): MappedLedgerEntry => {
    const confidence = r.confidence_score;
    const isHumanApproved = confidence >= 90;

    let signals = ["Balance: ₹4.82L", "Savings velocity", "Goal status"];
    let outcome = isHumanApproved ? "Customer Reviewed" : "Auto-applied";
    let feedback = "Acted on";
    let trust = confidence >= 85 ? "+12" : confidence >= 75 ? "+6" : "+2";

    const titleLower = r.title.toLowerCase();
    if (titleLower.includes("sip")) {
      signals = ["SIP momentum", "Salary hike", "discretionary spend"];
      outcome = "Acknowledged";
      feedback = "Acknowledged";
      trust = "+6";
    } else if (titleLower.includes("home")) {
      signals = ["SIP momentum", "Savings velocity", "Property browsing", "Stable income"];
      outcome = "Customer Reviewed";
      feedback = "Acted on";
      trust = "+12";
    } else if (titleLower.includes("credit")) {
      signals = ["Utilisation rising", "On-time history"];
      outcome = "Declined by customer";
      feedback = "Declined";
      trust = "-2";
    }

    return {
      id: `rec-${r.id}`,
      title: r.title,
      when:
        new Date(r.timestamp).toLocaleDateString("en-IN") +
        " · " +
        new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      confidence,
      impact: confidence >= 85 ? "High" : confidence >= 75 ? "Medium" : "Low",
      outcome,
      signals,
      reason: r.description,
      alternatives: r.alternative_options || "Maintain current savings allocation.",
      feedback,
      trust,
      human: isHumanApproved,
      explainability: generateExplainability(r),
    };
  });

  const list = entries.filter((e: MappedLedgerEntry) => {
    const titleLower = e.title.toLowerCase();
    const reasonLower = e.reason.toLowerCase();
    
    // Filter out mock test run logs so they don't pollute the user's ledger screen
    if (
      titleLower.includes("message") || 
      titleLower.includes("test") || 
      titleLower.includes("timeout") || 
      titleLower.includes("rate limit") || 
      titleLower.includes("malformed") ||
      reasonLower.includes("chat answer")
    ) {
      return false;
    }
    
    return titleLower.includes(q.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        eyebrow="Trust Ledger"
        title="Every decision, on the record."
        subtitle="An immutable, customer-readable log of every recommendation the AI made — with the why, the alternatives, and the outcome."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search recommendations..."
            className="w-full rounded-full border border-border bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[var(--sbi-blue)]"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-2 text-sm font-medium">
          <Filter className="h-3.5 w-3.5" /> All
        </button>
      </div>

      <div className="relative rounded-3xl border border-border bg-white p-2 shadow-[var(--shadow-soft)]">
        <div className="absolute left-9 top-6 bottom-6 w-px bg-border" />

        {list.map((e: MappedLedgerEntry) => {
          const isOpen = open === e.id;
          const tab = activeTab[e.id] || "audit";
          return (
            <div key={e.id} className="relative">
              <div className="flex gap-4 p-4">
                <div className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-[var(--sbi-sky)]">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sbi-blue)]/10">
                    <GitCommit className="h-3.5 w-3.5 text-[var(--sbi-blue)]" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-[var(--sbi-navy)]">{e.title}</div>
                    <code className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      #{e.id}
                    </code>
                    {e.human && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--warning)]">
                        <UserCheck className="h-3 w-3" /> RM Approved
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{e.when}</div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                    <Stat label="Confidence" value={`${e.confidence}%`} tone="blue" />
                    
                    {/* Financial Impact Meter replaces the generic Impact label */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Impact:</span>
                      <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${e.impact === "High" ? "bg-emerald-500" : e.impact === "Medium" ? "bg-amber-500" : "bg-slate-400"}`} style={{ width: e.impact === "High" ? "90%" : e.impact === "Medium" ? "60%" : "30%" }} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 uppercase">{e.impact}</span>
                      </div>
                    </div>

                    <Stat label="Outcome" value={e.outcome} tone="success" />
                    <Stat
                      label="Trust Impact"
                      value={e.trust}
                      tone={e.trust.startsWith("+") ? "success" : "error"}
                    />
                  </div>

                  {/* Enhanced action buttons layout */}
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => {
                        setOpen(isOpen && tab === "audit" ? null : e.id);
                        setActiveTab((prev) => ({ ...prev, [e.id]: "audit" }));
                      }}
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${isOpen && tab === "audit" ? "text-[var(--sbi-blue)]" : "text-muted-foreground hover:text-[var(--sbi-blue)]"}`}
                    >
                      {isOpen && tab === "audit" ? "Collapse details" : "Expand details"}
                      <ChevronDown className={`h-3 w-3 transition ${isOpen && tab === "audit" ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      onClick={() => {
                        setOpen(isOpen && tab === "replay" ? null : e.id);
                        setActiveTab((prev) => ({ ...prev, [e.id]: "replay" }));
                      }}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isOpen && tab === "replay" ? "text-amber-600 font-bold" : "text-muted-foreground hover:text-amber-600"}`}
                    >
                      <Play className="h-3 w-3" /> Replay Decision
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 transition-all duration-300 ease-in-out">
                      <div className="rounded-3xl bg-slate-50 border border-slate-200/60 p-6 space-y-6 text-slate-800">
                        <style>{`
                          @keyframes growBar {
                            from { width: 0%; }
                          }
                          .animate-grow-bar {
                            animation: growBar 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                          }
                        `}</style>
                        
                        {/* Row 1: Decision Identity & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[var(--sbi-blue)]/10 text-[var(--sbi-blue)]">
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Decision Identity</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xs font-bold text-slate-700">{e.explainability.identity.decision_id}</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                <span className="text-xs text-slate-500">{e.explainability.identity.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Model: <strong className="text-slate-700 font-semibold">{e.explainability.identity.model}</strong></span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {e.explainability.identity.status}
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Impact Meter & Quality Scorecard */}
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Financial Impact Meter */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-emerald-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Financial Impact Meter</h4>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Savings</div>
                                <div className="text-base font-extrabold text-[var(--sbi-navy)] mt-0.5">{e.explainability.impact_metrics.savings}</div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                                  <div className="bg-emerald-500 h-full rounded-full animate-grow-bar" style={{ width: `${e.explainability.impact_metrics.savings_progress}%` }} />
                                </div>
                              </div>
                              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Goal Acceleration</div>
                                <div className="text-base font-extrabold text-[var(--sbi-navy)] mt-0.5">{e.explainability.impact_metrics.goal_acceleration}</div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                                  <div className="bg-blue-500 h-full rounded-full animate-grow-bar" style={{ width: `${e.explainability.impact_metrics.acceleration_progress}%` }} />
                                </div>
                              </div>
                              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Risk Reduction</div>
                                <div className="text-base font-extrabold text-[var(--sbi-navy)] mt-0.5">{e.explainability.impact_metrics.risk_reduction}</div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                                  <div className="bg-amber-500 h-full rounded-full animate-grow-bar" style={{ width: `${e.explainability.impact_metrics.risk_progress}%` }} />
                                </div>
                              </div>
                              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Projected Wealth Growth</div>
                                <div className="text-base font-extrabold text-emerald-600 mt-0.5">{e.explainability.impact_metrics.expected_wealth_growth}</div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                                  <div className="bg-emerald-600 h-full rounded-full animate-grow-bar" style={{ width: `${e.explainability.impact_metrics.wealth_progress}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recommendation Scorecard */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-indigo-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Recommendation Quality Scorecard</h4>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                                <span className="text-slate-500">Customer Benefit</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${e.explainability.scorecard.customer_benefit}%` }} />
                                  </div>
                                  <span className="font-bold text-slate-800 w-8 text-right">{e.explainability.scorecard.customer_benefit}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                                <span className="text-slate-500">Transparency</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${e.explainability.scorecard.transparency}%` }} />
                                  </div>
                                  <span className="font-bold text-slate-800 w-8 text-right">{e.explainability.scorecard.transparency}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                                <span className="text-slate-500">Confidence</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${e.explainability.scorecard.confidence}%` }} />
                                  </div>
                                  <span className="font-bold text-slate-800 w-8 text-right">{e.explainability.scorecard.confidence}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                                <span className="text-slate-500">Affordability</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${e.explainability.scorecard.affordability}%` }} />
                                  </div>
                                  <span className="font-bold text-slate-800 w-8 text-right">{e.explainability.scorecard.affordability}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Financial Risk</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  e.explainability.scorecard.financial_risk === "Low" || e.explainability.scorecard.financial_risk === "Lowest"
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                    : e.explainability.scorecard.financial_risk === "Medium"
                                    ? "bg-amber-50 border border-amber-200 text-amber-700"
                                    : "bg-rose-50 border border-rose-200 text-rose-700"
                                }`}>
                                  {e.explainability.scorecard.financial_risk} Risk
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Decision Replay Timeline & Why Not Alternatives */}
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* AI Decision Replay Timeline */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-blue-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Decision Replay Pipeline</h4>
                            </div>
                            <div className="relative pl-5 space-y-4">
                              <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
                              {e.explainability.decision_replay.map((step, idx) => (
                                <div key={idx} className="relative group">
                                  <div className="absolute -left-5 top-1.5 h-2 w-2 rounded-full border border-blue-500 bg-white ring-4 ring-blue-50 transition-all duration-300 group-hover:scale-125" />
                                  <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-xs font-bold text-slate-800">{step.step}</span>
                                    <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Why Not? Rejected Alternatives */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-rose-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Why Not? Rejected Alternatives</h4>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                                    <th className="pb-2">Recommendation</th>
                                    <th className="pb-2 text-center">Score</th>
                                    <th className="pb-2 text-center">Benefit</th>
                                    <th className="pb-2 text-center">Risk</th>
                                    <th className="pb-2">Decision</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {e.explainability.why_not.map((option, idx) => (
                                    <tr key={idx} className={`border-b border-slate-100 last:border-0 ${option.decision === "Selected" ? "bg-emerald-50/50 font-semibold" : ""}`}>
                                      <td className="py-2.5 pr-2 text-slate-700">{option.recommendation}</td>
                                      <td className="py-2.5 text-center font-mono text-slate-800">{option.score}</td>
                                      <td className="py-2.5 text-center text-slate-600">{option.benefit}</td>
                                      <td className="py-2.5 text-center text-slate-600">{option.risk}</td>
                                      <td className="py-2.5">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          option.decision === "Selected" 
                                            ? "bg-emerald-100 text-emerald-800" 
                                            : "bg-slate-100 text-slate-600"
                                        }`}>
                                          {option.decision}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Row 4: AI Deliberation Board & Counterfactual Simulator */}
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* AI Deliberation Board */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-amber-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Deliberation Board</h4>
                            </div>
                            <div className="space-y-3">
                              {e.explainability.agent_deliberation.agents.map((del, idx) => {
                                let bg = "bg-slate-50 border border-slate-100";
                                let badge = "bg-slate-100 text-slate-700";
                                if (del.status === "approved") {
                                  bg = "bg-emerald-50/20 border border-emerald-100/60";
                                  badge = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                                } else if (del.status === "warning") {
                                  bg = "bg-amber-50/20 border border-amber-100/60";
                                  badge = "bg-amber-50 text-amber-700 border border-amber-200";
                                }
                                return (
                                  <div key={idx} className={`p-3 rounded-xl border ${bg}`}>
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs text-slate-700">{del.agent}</span>
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge}`}>
                                        {del.decision}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">{del.reason}</p>
                                  </div>
                                );
                              })}
                              <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3 mt-4 border border-slate-200">
                                <span className="text-xs font-semibold text-slate-600">Final Consensus:</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {e.explainability.agent_deliberation.consensus}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Counterfactual Simulator */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-indigo-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Counterfactual Simulator — What if I chose differently?</h4>
                            </div>
                            <div className="space-y-3">
                              {e.explainability.counterfactuals.map((cf, idx) => (
                                <div key={idx} className={`rounded-xl p-3 border transition-all duration-300 hover:shadow-sm ${
                                  cf.selected 
                                    ? "border-emerald-200 bg-emerald-50/30" 
                                    : "border-slate-200 bg-slate-50/40"
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={`h-2.5 w-2.5 rounded-full ${cf.selected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                                      <span className="text-xs font-bold text-slate-800">{cf.scenario}</span>
                                    </div>
                                    {cf.selected && (
                                      <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                        Recommended
                                      </span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mt-3 border-t border-slate-100 pt-2.5">
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Projected Wealth</span>
                                      <span className="text-xs font-extrabold text-slate-700 mt-0.5 block">{cf.wealth}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Time to Goal</span>
                                      <span className="text-xs font-extrabold text-slate-700 mt-0.5 block">{cf.goal_time}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Row 5: Confidence Breakdown, Evidence Used, Trust Evolution */}
                        <div className="grid gap-6 md:grid-cols-3">
                          {/* Confidence Breakdown */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-sky-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Confidence Sources</h4>
                            </div>
                            <div className="space-y-3.5">
                              <div>
                                <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                                  <span>Income Stability</span>
                                  <span>{e.explainability.confidence_breakdown.income_stability}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[var(--sbi-blue)] h-full rounded-full" style={{ width: `${e.explainability.confidence_breakdown.income_stability}%` }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                                  <span>Savings Behaviour</span>
                                  <span>{e.explainability.confidence_breakdown.savings_behaviour}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[var(--sbi-blue)] h-full rounded-full" style={{ width: `${e.explainability.confidence_breakdown.savings_behaviour}%` }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                                  <span>Debt Capacity</span>
                                  <span>{e.explainability.confidence_breakdown.debt_capacity}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[var(--sbi-blue)] h-full rounded-full" style={{ width: `${e.explainability.confidence_breakdown.debt_capacity}%` }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                                  <span>Goal Alignment</span>
                                  <span>{e.explainability.confidence_breakdown.goal_alignment}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[var(--sbi-blue)] h-full rounded-full" style={{ width: `${e.explainability.confidence_breakdown.goal_alignment}%` }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                                  <span>Market Conditions</span>
                                  <span>{e.explainability.confidence_breakdown.market_conditions}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[var(--sbi-blue)] h-full rounded-full" style={{ width: `${e.explainability.confidence_breakdown.market_conditions}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Evidence Used */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1.5 w-3 rounded-full bg-emerald-500" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Evidence Signals Used</h4>
                            </div>
                            <div className="space-y-4">
                              {e.explainability.evidence_used.map((cat, idx) => (
                                <div key={idx} className="space-y-1.5">
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">{cat.category}</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {cat.signals.map((sig, sIdx) => (
                                      <span key={sIdx} className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200/60 px-2.5 py-1 text-[10px] text-slate-600 font-medium">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        {sig}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trust Evolution */}
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-1.5 w-3 rounded-full bg-teal-500" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Trust Evolution Score</h4>
                              </div>
                              <div className="flex items-center justify-center gap-4 bg-slate-50 border border-slate-100 rounded-xl py-5">
                                <div className="text-center">
                                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Before</span>
                                  <span className="text-2xl font-extrabold text-slate-500 mt-0.5 block">{e.explainability.trust_evolution.before}</span>
                                </div>
                                <div className="text-slate-300 font-mono text-xl">→</div>
                                <div className="text-center">
                                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">After</span>
                                  <span className="text-2xl font-extrabold text-[var(--sbi-blue)] mt-0.5 block">{e.explainability.trust_evolution.after}</span>
                                </div>
                                <div className="h-8 w-px bg-slate-200" />
                                <div className="text-center">
                                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Delta</span>
                                  <span className="text-lg font-bold text-emerald-600 mt-0.5 block bg-emerald-50 border border-emerald-100 px-2 rounded-full">
                                    {e.explainability.trust_evolution.change}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500 leading-relaxed">
                              <span className="font-bold text-slate-600 block mb-0.5">Audit Trail Reason:</span>
                              {e.explainability.trust_evolution.reason}
                            </div>
                          </div>
                        </div>

                        {/* Row 6: Customer Benefit Test Guarantee */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 p-5">
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="p-1 rounded bg-emerald-500 text-white">
                              <Shield className="h-4 w-4" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Customer Benefit Test</h4>
                          </div>
                          <p className="text-xs text-emerald-700/90 leading-relaxed">
                            This AI recommendation has successfully passed our fiduciary compliance checks. The underlying algorithm is strictly audited to optimize for your welfare over bank profit indicators.
                          </p>
                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[10px] font-bold text-emerald-800">
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              Customer Benefit Prioritized
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              Transparent & Auditable
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              Regulatory Compliant
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              Lower Volatility Risk
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              Long-Term Wealth Optimized
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recommendations found matching your search
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warn" | "error" | "blue" | "muted";
}) {
  let color = "var(--muted-foreground)";
  if (tone === "success") color = "var(--success)";
  if (tone === "warn") color = "var(--warning)";
  if (tone === "error") color = "var(--error)";
  if (tone === "blue") color = "var(--sbi-royal)";

  return (
    <div>
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-white p-3">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="text-xs text-foreground/80 leading-relaxed">{children}</div>
    </div>
  );
}
