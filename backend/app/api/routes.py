from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from typing import List

from app.db.session import get_db
from app.models.models import User, LifeEvent, AIRecommendation, Offer, Notification, Setting, TrustLedgerEntry, Account
from app.schemas.schemas import (
    LifeEventCreate,
    LifeEventOut,
    AIRecommendationOut,
    OfferOut,
    NotificationOut,
    SettingOut,
    SettingUpdate
)
from app.auth.dependencies import get_current_user

router = APIRouter(tags=["general"])

# 1. Life Events
@router.get("/life-events", response_model=List[LifeEventOut])
async def get_life_events(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(LifeEvent).filter_by(user_id=current_user.id))
    return result.scalars().all()

@router.post("/life-events", response_model=LifeEventOut, status_code=status.HTTP_201_CREATED)
async def create_life_event(
    payload: LifeEventCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    confidence = payload.confidence
    if confidence is None:
        # Dynamic confidence based on title length and character sums
        # simulating AI/analytical feasibility assessment
        title_hash = sum(ord(c) for c in payload.title)
        confidence = 65 + (title_hash % 26)

    le = LifeEvent(
        user_id=current_user.id,
        title=payload.title,
        confidence=confidence,
        prediction_date=payload.prediction_date,
        explanation=payload.explanation
    )
    db.add(le)
    await db.commit()
    await db.refresh(le)
    return le

@router.get("/life-events/{id}", response_model=LifeEventOut)
async def get_life_event(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(LifeEvent).filter_by(id=id, user_id=current_user.id))
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Life event not found")
    return event

# 2. Trust Ledger (Explainable AI Recommendations)
def generate_explainability_backend(title: str, confidence_score: int, impact_str: str, timestamp_val) -> dict:
    title_lower = title.lower()
    
    # Category mapping
    category = "Default"
    if "home" in title_lower or "villa" in title_lower or "house" in title_lower or "mortgage" in title_lower:
        category = "Home Purchase"
    elif "wedding" in title_lower or "marriage" in title_lower:
        category = "Wedding"
    elif "trip" in title_lower or "travel" in title_lower or "vacation" in title_lower or "paris" in title_lower:
        category = "International Trip"
    elif "sip" in title_lower or "mutual fund" in title_lower:
        category = "SIP"
    elif "credit card" in title_lower or "limit" in title_lower or "card" in title_lower:
        category = "Credit Card"
    elif "invest" in title_lower or "fd" in title_lower or "fixed deposit" in title_lower or "savings" in title_lower:
        category = "Investment"
    elif "insurance" in title_lower or "policy" in title_lower or "premium" in title_lower:
        category = "Insurance"
    elif "retirement" in title_lower or "pension" in title_lower or "nps" in title_lower:
        category = "Retirement"
    elif "education" in title_lower or "study" in title_lower or "university" in title_lower or "college" in title_lower or "mba" in title_lower:
        category = "Education"

    # Format timestamp
    ts_str = "5 Jul 2026"
    if timestamp_val:
        try:
            ts_str = timestamp_val.strftime("%d %b %Y")
        except Exception:
            pass

    # Dynamic or deterministic values based on category:
    # 1. Decision Replay Steps
    if category == "Home Purchase":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "09:00 AM", "explanation": "Verified stable monthly salary of ₹1.8L and ₹4.8L savings."},
            {"step": "Pattern Detection", "timestamp": "09:10 AM", "explanation": "Detected consistent savings rate of 26% and property search triggers."},
            {"step": "Goal Matching", "timestamp": "09:20 AM", "explanation": "Matched parameters with active 'Home Purchase' goal for March 2026."},
            {"step": "Risk Assessment", "timestamp": "09:30 AM", "explanation": "Calculated low debt-to-income (DTI) ratio (14%). Moderate risk profile."},
            {"step": "Alternative Evaluation", "timestamp": "09:40 AM", "explanation": "Analyzed renting vs purchasing mortgage yields over a 15-year tenure."},
            {"step": "Customer Benefit Check", "timestamp": "09:50 AM", "explanation": "Down payment path optimized for wealth growth, minimizing interest cost."},
            {"step": "Compliance Review", "timestamp": "10:00 AM", "explanation": "Passed all national mortgage loan-to-value (LTV) limits."},
            {"step": "Final Recommendation", "timestamp": "10:10 AM", "explanation": "SIP allocation increased to reach down payment target 14 months faster."}
        ]
        why_not = [
            {"recommendation": "Increase SIP (Recommended) ⭐", "score": 96, "benefit": "High", "risk": "Low", "decision": "Selected"},
            {"recommendation": "Fixed Deposit Sweep", "score": 82, "benefit": "Medium", "risk": "Low", "decision": "Lower long-term return"},
            {"recommendation": "Leave Cash Idle", "score": 61, "benefit": "Low", "risk": "Very Low", "decision": "Inflation loss"},
            {"recommendation": "Personal Loan later", "score": 39, "benefit": "Low", "risk": "High", "decision": "Higher borrowing cost"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Monthly income supports down payment SIP timeline.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "DTI is healthy at 14%. Emergency buffer intact.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Reduces long term renting expense drain.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Passed all banking loan-to-value guidelines.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹28.4L", "goal_time": "8 years", "risk": "Low", "selected": True},
            {"scenario": "Fixed Deposit", "wealth": "₹23.1L", "goal_time": "9.5 years", "risk": "Very Low", "selected": False},
            {"scenario": "Savings Account", "wealth": "₹19.7L", "goal_time": "11 years", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹45,000",
            "savings_progress": 75,
            "goal_acceleration": "14 Months Faster",
            "acceleration_progress": 90,
            "risk_reduction": "22%",
            "risk_progress": 70,
            "expected_wealth_growth": "+₹12.4L",
            "wealth_progress": 82
        }
        confidence_breakdown = {
            "income_stability": 96,
            "savings_behaviour": 88,
            "debt_capacity": 81,
            "goal_alignment": 100,
            "market_conditions": 84
        }
        evidence_used = [
            {"category": "Income", "signals": ["Salary Credits Verified", "Stable Income flow"]},
            {"category": "Savings", "signals": ["Emergency Fund Present", "Savings Growth trend"]},
            {"category": "Goals", "signals": ["Home Purchase predicted"]},
            {"category": "Risk", "signals": ["High Credit Score", "Low Debt Ratio"]}
        ]
        trust_evolution = {
            "before": 84,
            "after": 96,
            "change": "+12",
            "reason": "Recommendation explained with evidence and alternatives."
        }
        scorecard = {
            "customer_benefit": 96,
            "transparency": 100,
            "financial_risk": "Low",
            "confidence": 92,
            "affordability": 84
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }
    elif category == "Wedding":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "09:00 AM", "explanation": "Verified monthly income of ₹1.8L and ₹3.2L liquid balances."},
            {"step": "Pattern Detection", "timestamp": "09:10 AM", "explanation": "Detected recurring wedding venue deposit searches and savings spikes."},
            {"step": "Goal Matching", "timestamp": "09:20 AM", "explanation": "Aligned with target 'Wedding Fund' milestone for November 2026."},
            {"step": "Risk Assessment", "timestamp": "09:30 AM", "explanation": "Shifted risk index to conservative-balanced due to short horizon."},
            {"step": "Alternative Evaluation", "timestamp": "09:40 AM", "explanation": "Compared high-interest liquid sweep deposits vs short-term arbitrage funds."},
            {"step": "Customer Benefit Check", "timestamp": "09:50 AM", "explanation": "Prevented lock-in penalties while securing stable 7.5% returns."},
            {"step": "Compliance Review", "timestamp": "10:00 AM", "explanation": "Ensured capital limits align with tax exemption thresholds."},
            {"step": "Final Recommendation", "timestamp": "10:10 AM", "explanation": "Rebalanced ₹50,000 to safe short-term mutual fund SIP."}
        ]
        why_not = [
            {"recommendation": "Rebalance to Hybrid SIP ⭐", "score": 91, "benefit": "High", "risk": "Low", "decision": "Selected"},
            {"recommendation": "Fixed Deposit Sweep", "score": 84, "benefit": "Medium", "risk": "Low", "decision": "Low tax efficiency"},
            {"recommendation": "Take Personal Loan later", "score": 45, "benefit": "Low", "risk": "High", "decision": "High interest rates"},
            {"recommendation": "Leave Cash in Savings", "score": 62, "benefit": "Low", "risk": "Very Low", "decision": "Lower interest"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Shift to hybrid ensures target is locked safely.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "Balanced risk keeps volatility below 5%.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Low cost alternative avoids personal loan debt.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Scheme disclosures provided.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹15.8L", "goal_time": "1.2 years", "risk": "Low", "selected": True},
            {"scenario": "Personal Loan", "wealth": "₹15.0L", "goal_time": "Immediate", "risk": "High", "selected": False},
            {"scenario": "Savings Account", "wealth": "₹13.8L", "goal_time": "1.5 years", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹1.2L loan interest saved",
            "savings_progress": 85,
            "goal_acceleration": "3 Months Faster",
            "acceleration_progress": 75,
            "risk_reduction": "40% Volatility Drop",
            "risk_progress": 90,
            "expected_wealth_growth": "+₹1.8L savings",
            "wealth_progress": 80
        }
        confidence_breakdown = {
            "income_stability": 95,
            "savings_behaviour": 90,
            "debt_capacity": 88,
            "goal_alignment": 98,
            "market_conditions": 85
        }
        evidence_used = [
            {"category": "Income", "signals": ["Salary credit verified"]},
            {"category": "Savings", "signals": ["Emergency reserves active"]},
            {"category": "Goals", "signals": ["Wedding milestone targeted"]},
            {"category": "Risk", "signals": ["Conservative shift requested"]}
        ]
        trust_evolution = {
            "before": 86,
            "after": 91,
            "change": "+5",
            "reason": "Capital security and loan avoidance strategy made fully visible."
        }
        scorecard = {
            "customer_benefit": 91,
            "transparency": 100,
            "financial_risk": "Low",
            "confidence": 91,
            "affordability": 88
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }
    elif category == "International Trip":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "10:00 AM", "explanation": "Mapped vacation search cookies and passport renewal alerts."},
            {"step": "Pattern Detection", "timestamp": "10:10 AM", "explanation": "Detected seasonal travel budgeting and foreign exchange transactions."},
            {"step": "Goal Matching", "timestamp": "10:20 AM", "explanation": "Matched with active 'Paris Trip' timeline for June 2027."},
            {"step": "Risk Assessment", "timestamp": "10:30 AM", "explanation": "High liquidity requirement limits target options to highly liquid funds."},
            {"step": "Alternative Evaluation", "timestamp": "10:40 AM", "explanation": "Compared foreign currency savings deposits vs multi-currency travel card sweeps."},
            {"step": "Customer Benefit Check", "timestamp": "10:50 AM", "explanation": "Lock-in dynamic forex rates to hedge exchange volatility."},
            {"step": "Compliance Review", "timestamp": "11:00 AM", "explanation": "Passed Liberalised Remittance Scheme (LRS) tax limits."},
            {"step": "Final Recommendation", "timestamp": "11:10 AM", "explanation": "Initialize recurring sweep of ₹15,000 monthly to trip fund."}
        ]
        why_not = [
            {"recommendation": "Foreign Currency Sweep ⭐", "score": 88, "benefit": "High", "risk": "Low", "decision": "Selected"},
            {"recommendation": "Credit Card Funding", "score": 50, "benefit": "Low", "risk": "High", "decision": "Currency markup fees (3.5%)"},
            {"recommendation": "Cash Accumulation", "score": 60, "benefit": "Low", "risk": "Lowest", "decision": "Loss of yield"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Smooth out forex volatility using recurring card sweeps.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "Avoid credit card debt traps for leisure expenses.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Dynamic exchange lock secures travel budget.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Remittance limits compliant.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹2.2L vacation fund", "goal_time": "11 months", "risk": "Low", "selected": True},
            {"scenario": "Credit Card", "wealth": "₹2.0L debt", "goal_time": "Post-trip", "risk": "High", "selected": False},
            {"scenario": "Savings Account", "wealth": "₹1.9L fund", "goal_time": "14 months", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹22,000 markup saved",
            "savings_progress": 75,
            "goal_acceleration": "3 Months Faster",
            "acceleration_progress": 70,
            "risk_reduction": "15% Forex Hedge",
            "risk_progress": 80,
            "expected_wealth_growth": "+₹30,000 markup savings",
            "wealth_progress": 72
        }
        confidence_breakdown = {
            "income_stability": 94,
            "savings_behaviour": 86,
            "debt_capacity": 92,
            "goal_alignment": 95,
            "market_conditions": 75
        }
        evidence_used = [
            {"category": "Income", "signals": ["Consistent monthly income"]},
            {"category": "Savings", "signals": ["Travel savings account active"]},
            {"category": "Goals", "signals": ["Paris Trip targeted"]},
            {"category": "Risk", "signals": ["Zero-debt funding preferred"]}
        ]
        trust_evolution = {
            "before": 84,
            "after": 88,
            "change": "+4",
            "reason": "Forex hedging and markup savings transparently verified."
        }
        scorecard = {
            "customer_benefit": 88,
            "transparency": 100,
            "financial_risk": "Low",
            "confidence": 88,
            "affordability": 92
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }
    elif category == "SIP":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "10:00 AM", "explanation": "Verified discretionary spending reduced by 15%."},
            {"step": "Pattern Detection", "timestamp": "10:10 AM", "explanation": "Detected unallocated monthly surplus cash flow."},
            {"step": "Goal Matching", "timestamp": "10:20 AM", "explanation": "Matched with long-term wealth compounding objectives."},
            {"step": "Risk Assessment", "timestamp": "10:30 AM", "explanation": "Confirmed growth risk profile permits equity mutual fund exposure."},
            {"step": "Alternative Evaluation", "timestamp": "10:40 AM", "explanation": "Compared mutual fund SIP compounding vs debt instruments vs cash."},
            {"step": "Customer Benefit Check", "timestamp": "10:50 AM", "explanation": "Maximized returns using tax-efficient equity savings."},
            {"step": "Compliance Review", "timestamp": "11:00 AM", "explanation": "Validated KYC and risk suitability parameters."},
            {"step": "Final Recommendation", "timestamp": "11:10 AM", "explanation": "SIP contribution increased by ₹3,000 monthly."}
        ]
        why_not = [
            {"recommendation": "Increase SIP by ₹3k ⭐", "score": 92, "benefit": "High", "risk": "Moderate", "decision": "Selected"},
            {"recommendation": "One-time Lump Sum", "score": 75, "benefit": "High", "risk": "High", "decision": "Timing risk"},
            {"recommendation": "Deploy in FD", "score": 70, "benefit": "Medium", "risk": "Low", "decision": "Lower long-term returns"},
            {"recommendation": "Leave Cash Idle", "score": 58, "benefit": "Low", "risk": "Lowest", "decision": "Inflation erosion"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Compounding maximizes long term goal achievements.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "Dollar-cost averaging mitigates market volatility.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Fits easily within verified monthly savings surplus.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "KYC and fund selection align with policy.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹18.5L", "goal_time": "6 years", "risk": "Moderate", "selected": True},
            {"scenario": "Fixed Deposit", "wealth": "₹13.4L", "goal_time": "7.5 years", "risk": "Low", "selected": False},
            {"scenario": "Savings Account", "wealth": "₹9.2L", "goal_time": "9 years", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹18,500",
            "savings_progress": 68,
            "goal_acceleration": "11 Months Faster",
            "acceleration_progress": 80,
            "risk_reduction": "18%",
            "risk_progress": 78,
            "expected_wealth_growth": "+₹6.8L",
            "wealth_progress": 75
        }
        confidence_breakdown = {
            "income_stability": 94,
            "savings_behaviour": 90,
            "debt_capacity": 85,
            "goal_alignment": 95,
            "market_conditions": 76
        }
        evidence_used = [
            {"category": "Income", "signals": ["Increment Mapped", "Consistent Cash Inflow"]},
            {"category": "Savings", "signals": ["Investment Surplus Detected", "Discretionary Spend Drop (15%)"]},
            {"category": "Goals", "signals": ["Compounding target set"]},
            {"category": "Risk", "signals": ["Moderate-High Risk Tolerance"]}
        ]
        trust_evolution = {
            "before": 88,
            "after": 94,
            "change": "+6",
            "reason": "Compounding advantages and cost mitigations made transparent."
        }
        scorecard = {
            "customer_benefit": 92,
            "transparency": 100,
            "financial_risk": "Medium",
            "confidence": 90,
            "affordability": 90
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }
    elif category == "Credit Card":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "08:00 AM", "explanation": "Verified 12-month prompt payment history and 38% card utilization."},
            {"step": "Pattern Detection", "timestamp": "08:10 AM", "explanation": "Identified seasonal credit spikes and utilization approaching warning limits."},
            {"step": "Goal Matching", "timestamp": "08:20 AM", "explanation": "Matched with goal to optimize credit score card rating."},
            {"step": "Risk Assessment", "timestamp": "08:30 AM", "explanation": "Calculated low default risk tier based on continuous salary credits."},
            {"step": "Alternative Evaluation", "timestamp": "08:40 AM", "explanation": "Compared raising limit vs taking personal line of credit vs leaving limits unchanged."},
            {"step": "Customer Benefit Check", "timestamp": "08:50 AM", "explanation": "Limit enhancement reduces utilization index without cost."},
            {"step": "Compliance Review", "timestamp": "09:00 AM", "explanation": "Aligned with maximum credit multi-brackets for income class."},
            {"step": "Final Recommendation", "timestamp": "09:10 AM", "explanation": "Recommend increasing credit card limit by ₹1.5L."}
        ]
        why_not = [
            {"recommendation": "Raise Card Limit ⭐", "score": 95, "benefit": "High", "risk": "Low", "decision": "Selected"},
            {"recommendation": "Personal Loan", "score": 45, "benefit": "Medium", "risk": "Medium", "decision": "Interest overhead"},
            {"recommendation": "Use Emergency FD", "score": 60, "benefit": "Low", "risk": "Low", "decision": "Buffer depletion"},
            {"recommendation": "Minimum Due Pay", "score": 30, "benefit": "Lowest", "risk": "High", "decision": "High interest p.a."}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Limit raise provides immediate liquidity backup.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend with conditions", "reason": "Verify utilization remains below 30% post-enhancement.", "status": "warning"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Pre-approved zero-fee offer prevents cost additions.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Credit risk criteria successfully cleared.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹1.5L buffer", "goal_time": "Immediate", "risk": "Low", "selected": True},
            {"scenario": "Personal Loan", "wealth": "₹1.5L debt", "goal_time": "3 days", "risk": "Medium", "selected": False},
            {"scenario": "Current Limit", "wealth": "₹0 buffer", "goal_time": "N/A", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹0 (limit increase)",
            "savings_progress": 30,
            "goal_acceleration": "Immediate Activation",
            "acceleration_progress": 95,
            "risk_reduction": "5% Utilization Drop",
            "risk_progress": 95,
            "expected_wealth_growth": "+₹1.5L buffer",
            "wealth_progress": 60
        }
        confidence_breakdown = {
            "income_stability": 98,
            "savings_behaviour": 85,
            "debt_capacity": 96,
            "goal_alignment": 90,
            "market_conditions": 88
        }
        evidence_used = [
            {"category": "Income", "signals": ["Income bracket threshold cleared", "Prompt Payment History"]},
            {"category": "Savings", "signals": ["Positive Monthly Surplus"]},
            {"category": "Goals", "signals": ["Credit Score Optimization"]},
            {"category": "Risk", "signals": ["Low Delinquency Tier", "No Outstanding Overdues"]}
        ]
        trust_evolution = {
            "before": 92,
            "after": 90,
            "change": "-2",
            "reason": "Recommendation declined, but credit health warnings acknowledged."
        }
        scorecard = {
            "customer_benefit": 95,
            "transparency": 100,
            "financial_risk": "Low",
            "confidence": 95,
            "affordability": 98
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": False
        }
    elif category == "Investment":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "11:00 AM", "explanation": "Verified average monthly expenses and liquid balance of ₹4.82L."},
            {"step": "Pattern Detection", "timestamp": "11:10 AM", "explanation": "Detected sub-optimal interest yield on idle savings deposits."},
            {"step": "Goal Matching", "timestamp": "11:20 AM", "explanation": "Matched with Emergency Fund target of 6 months expenses."},
            {"step": "Risk Assessment", "timestamp": "11:30 AM", "explanation": "Ensured risk-free capital preservation with instant access."},
            {"step": "Alternative Evaluation", "timestamp": "11:40 AM", "explanation": "Compared sweep-in Fixed Deposits vs short-term debt funds vs cash holdings."},
            {"step": "Customer Benefit Check", "timestamp": "11:50 AM", "explanation": "Locked guaranteed 7.2% yield while maintaining complete liquidity."},
            {"step": "Compliance Review", "timestamp": "12:00 PM", "explanation": "Verified DICGC deposit insurance compliance regulations."},
            {"step": "Final Recommendation", "timestamp": "12:10 PM", "explanation": "Transfer ₹15,000 to sweep-in Fixed Deposit."}
        ]
        why_not = [
            {"recommendation": "Top-up Emergency FD ⭐", "score": 88, "benefit": "Medium", "risk": "Lowest", "decision": "Selected"},
            {"recommendation": "Equity Mutual Funds", "score": 64, "benefit": "High", "risk": "Medium", "decision": "Short-term market risk"},
            {"recommendation": "Keep in Savings Account", "score": 72, "benefit": "Low", "risk": "Lowest", "decision": "Lower yield (4% p.a.)"},
            {"recommendation": "Physical Gold", "score": 48, "benefit": "Medium", "risk": "Low", "decision": "Transaction spread/illiquid"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Boosts returns on idle cash reserves.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "FD provides zero capital volatility, ideal for reserves.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Retains liquidity for immediate emergency access.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Complies fully with deposit protection policies.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹15,000 secure", "goal_time": "Immediate", "risk": "Lowest", "selected": True},
            {"scenario": "Equity Fund", "wealth": "₹16,500 expected", "goal_time": "1.5 years", "risk": "Moderate", "selected": False},
            {"scenario": "Savings Account", "wealth": "₹15,000 cash", "goal_time": "Continuous", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹15,000",
            "savings_progress": 85,
            "goal_acceleration": "Immediate Allocation",
            "acceleration_progress": 99,
            "risk_reduction": "45% Risk Cover",
            "risk_progress": 85,
            "expected_wealth_growth": "+₹3,600/year",
            "wealth_progress": 70
        }
        confidence_breakdown = {
            "income_stability": 95,
            "savings_behaviour": 92,
            "debt_capacity": 90,
            "goal_alignment": 99,
            "market_conditions": 82
        }
        evidence_used = [
            {"category": "Income", "signals": ["Salary Credit Confirmed"]},
            {"category": "Savings", "signals": ["Emergency Fund below 6-mo target", "Idle cash in savings account"]},
            {"category": "Goals", "signals": ["Emergency buffer top-up"]},
            {"category": "Risk", "signals": ["Guaranteed return preference"]}
        ]
        trust_evolution = {
            "before": 80,
            "after": 92,
            "change": "+12",
            "reason": "Guaranteed yield optimization with zero risk is transparently presented."
        }
        scorecard = {
            "customer_benefit": 88,
            "transparency": 100,
            "financial_risk": "Lowest",
            "confidence": 88,
            "affordability": 95
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }
    elif category == "Insurance":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "02:00 PM", "explanation": "Verified user's age, dependents, and ₹45L active home loan."},
            {"step": "Pattern Detection", "timestamp": "02:10 PM", "explanation": "Identified lack of term life insurance to cover major liabilities."},
            {"step": "Goal Matching", "timestamp": "02:20 PM", "explanation": "Matched with Family Protection and Mortgage Protection goals."},
            {"step": "Risk Assessment", "timestamp": "02:30 PM", "explanation": "Calculated high financial risk to dependents in case of premature death."},
            {"step": "Alternative Evaluation", "timestamp": "02:40 PM", "explanation": "Compared pure Term Cover vs Endowment savings plan vs self-funding."},
            {"step": "Customer Benefit Check", "timestamp": "02:50 PM", "explanation": "Term insurance offers maximum cover with extremely low premium outgo."},
            {"step": "Compliance Review", "timestamp": "03:00 PM", "explanation": "Adheres to IRDAI premium disclosures and eligibility requirements."},
            {"step": "Final Recommendation", "timestamp": "03:10 PM", "explanation": "Purchase Term Life Cover of ₹1 Cr to cover outstanding home loan."}
        ]
        why_not = [
            {"recommendation": "Term Cover (₹1 Cr) ⭐", "score": 94, "benefit": "High", "risk": "Lowest", "decision": "Selected"},
            {"recommendation": "Endowment Policy", "score": 65, "benefit": "Medium", "risk": "Low", "decision": "High cost / low cover"},
            {"recommendation": "Self-Insurance", "score": 50, "benefit": "Low", "risk": "High", "decision": "Insufficient net worth"},
            {"recommendation": "Personal Loan cover", "score": 25, "benefit": "Lowest", "risk": "High", "decision": "High family debt"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Secures family against mortgage liability.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "Transfers high-impact mortality risk to insurance pool.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Low premium rate minimizes monthly cash flow impact.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "KYC and disclosure conditions fully met.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹1 Cr cover", "goal_time": "Instant", "risk": "Lowest", "selected": True},
            {"scenario": "Endowment Plan", "wealth": "₹20L expected", "goal_time": "15 years", "risk": "Low", "selected": False},
            {"scenario": "Self-Insurance", "wealth": "₹9.8L cash", "goal_time": "N/A", "risk": "High", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹1.2L premiums saved",
            "savings_progress": 70,
            "goal_acceleration": "Immediate Protection",
            "acceleration_progress": 99,
            "risk_reduction": "95% Liability Cover",
            "risk_progress": 95,
            "expected_wealth_growth": "+₹1 Cr safety net",
            "wealth_progress": 90
        }
        confidence_breakdown = {
            "income_stability": 93,
            "savings_behaviour": 86,
            "debt_capacity": 89,
            "goal_alignment": 100,
            "market_conditions": 91
        }
        evidence_used = [
            {"category": "Income", "signals": ["Primary Breadwinner status verified"]},
            {"category": "Savings", "signals": ["Surplus covers monthly premium"]},
            {"category": "Goals", "signals": ["Family security", "Home Loan cover"]},
            {"category": "Risk", "signals": ["Mortgage default liability protection"]}
        ]
        trust_evolution = {
            "before": 85,
            "after": 97,
            "change": "+12",
            "reason": "Imperative family security risk coverage clearly reasoned."
        }
        scorecard = {
            "customer_benefit": 94,
            "transparency": 100,
            "financial_risk": "Lowest",
            "confidence": 93,
            "affordability": 96
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": False
        }
    elif category == "Retirement":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "03:00 PM", "explanation": "Verified user's age (32) and target retirement timeline (28 years)."},
            {"step": "Pattern Detection", "timestamp": "03:10 PM", "explanation": "Identified deficit in projected retirement corpus under current allocations."},
            {"step": "Goal Matching", "timestamp": "03:20 PM", "explanation": "Matched with retirement wealth building goal targets."},
            {"step": "Risk Assessment", "timestamp": "03:30 PM", "explanation": "Confirmed long horizon allows equity-heavy growth exposure."},
            {"step": "Alternative Evaluation", "timestamp": "03:40 PM", "explanation": "Compared NPS equity/debt mix vs traditional PPF vs savings account cash."},
            {"step": "Customer Benefit Check", "timestamp": "03:50 PM", "explanation": "NPS offers low expense ratios and dynamic lifecycle rebalancing."},
            {"step": "Compliance Review", "timestamp": "04:00 PM", "explanation": "Satisfied Sec 80CCD tax deduction compliance parameters."},
            {"step": "Final Recommendation", "timestamp": "04:10 PM", "explanation": "Open NPS account and contribute ₹5,000 monthly."}
        ]
        why_not = [
            {"recommendation": "NPS Account ⭐", "score": 90, "benefit": "High", "risk": "Moderate", "decision": "Selected"},
            {"recommendation": "PPF Account top-up", "score": 60, "benefit": "Medium", "risk": "Lowest", "decision": "Lower yield (fixed)"},
            {"recommendation": "Traditional Pension", "score": 50, "benefit": "Low", "risk": "Lowest", "decision": "High management fees"},
            {"recommendation": "Crypto assets", "score": 30, "benefit": "Lowest", "risk": "High", "decision": "Unsafe retirement volatility"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Compounding ensures sustainable post-retirement income.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "Lifecycle asset allocation automatically reduces risk with age.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Unlocks additional ₹50,000 annual tax exemption benefits.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Matches pension authority guidelines.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹45.2L corpus", "goal_time": "25 years", "risk": "Moderate", "selected": True},
            {"scenario": "PPF account", "wealth": "₹28.4L corpus", "goal_time": "25 years", "risk": "Lowest", "selected": False},
            {"scenario": "Savings Account", "wealth": "₹14.2L balance", "goal_time": "30 years", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹60,000/yr tax saved",
            "savings_progress": 80,
            "goal_acceleration": "5 Years Earlier",
            "acceleration_progress": 85,
            "risk_reduction": "30% Volatility Drop",
            "risk_progress": 72,
            "expected_wealth_growth": "+₹16.8L growth",
            "wealth_progress": 88
        }
        confidence_breakdown = {
            "income_stability": 92,
            "savings_behaviour": 89,
            "debt_capacity": 84,
            "goal_alignment": 98,
            "market_conditions": 78
        }
        evidence_used = [
            {"category": "Income", "signals": ["Current Salary level matches brackets"]},
            {"category": "Savings", "signals": ["Long term savings appetite confirmed"]},
            {"category": "Goals", "signals": ["Retirement planning target (60 yrs)"]},
            {"category": "Risk", "signals": ["Tax-saving capacity unused under Sec 80CCD"]}
        ]
        trust_evolution = {
            "before": 82,
            "after": 91,
            "change": "+9",
            "reason": "Long-term compounding pension growth benefits clearly explained."
        }
        scorecard = {
            "customer_benefit": 91,
            "transparency": 100,
            "financial_risk": "Medium",
            "confidence": 91,
            "affordability": 94
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }
    elif category == "Education":
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "09:00 AM", "explanation": "Verified user's MBA search trends and cash availability timeline."},
            {"step": "Pattern Detection", "timestamp": "09:15 AM", "explanation": "Detected upcoming fees liability (₹15L) in September 2027."},
            {"step": "Goal Matching", "timestamp": "09:30 AM", "explanation": "Matched with predicted Higher Education goal schedule."},
            {"step": "Risk Assessment", "timestamp": "09:45 AM", "explanation": "Checked that child/user education loans maintain overall safety levels."},
            {"step": "Alternative Evaluation", "timestamp": "10:00 AM", "explanation": "Compared dedicated education savings plans vs standard loans vs equity liquification."},
            {"step": "Customer Benefit Check", "timestamp": "10:15 AM", "explanation": "Optimized monthly reserves to cover 80% of fees, minimizing loan liability."},
            {"step": "Compliance Review", "timestamp": "10:30 AM", "explanation": "Complies with student planning tax exemption rules."},
            {"step": "Final Recommendation", "timestamp": "10:45 AM", "explanation": "Open a dedicated Education Savings Plan."}
        ]
        why_not = [
            {"recommendation": "Education Plan ⭐", "score": 87, "benefit": "High", "risk": "Moderate", "decision": "Selected"},
            {"recommendation": "Savings Account", "score": 55, "benefit": "Low", "risk": "Lowest", "decision": "Sub-optimal yield/fees gap"},
            {"recommendation": "Full Education Loan", "score": 70, "benefit": "Medium", "risk": "Medium", "decision": "High student debt burden"},
            {"recommendation": "Small Cap Equities", "score": 45, "benefit": "High", "risk": "High", "decision": "Pre-college market crash risk"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Secures college fees timeline accurately.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "Advises shifting to debt portfolio 6 months prior to goal.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Aligns savings milestones with expected MBA cost inflation.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Adheres to banking student schemes guidelines.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "₹12.4L saved", "goal_time": "2 years", "risk": "Moderate", "selected": True},
            {"scenario": "Full Student Loan", "wealth": "₹15.8L debt", "goal_time": "7 years", "risk": "Moderate", "selected": False},
            {"scenario": "Savings Account", "wealth": "₹9.1L saved", "goal_time": "3 years", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹35,000 fees discount",
            "savings_progress": 65,
            "goal_acceleration": "9 Months Faster",
            "acceleration_progress": 75,
            "risk_reduction": "15% Cash Strain Drop",
            "risk_progress": 80,
            "expected_wealth_growth": "+₹3.3L saved",
            "wealth_progress": 68
        }
        confidence_breakdown = {
            "income_stability": 91,
            "savings_behaviour": 87,
            "debt_capacity": 93,
            "goal_alignment": 97,
            "market_conditions": 80
        }
        evidence_used = [
            {"category": "Income", "signals": ["Consistent monthly savings capacity"]},
            {"category": "Savings", "signals": ["Education reserves account active"]},
            {"category": "Goals", "signals": ["MBA admission target (Sep 2027)"]},
            {"category": "Risk", "signals": ["Excellent parental credit rating"]}
        ]
        trust_evolution = {
            "before": 86,
            "after": 94,
            "change": "+8",
            "reason": "Goal-targeted educational savings timeline matched accurately."
        }
        scorecard = {
            "customer_benefit": 87,
            "transparency": 100,
            "financial_risk": "Medium",
            "confidence": 87,
            "affordability": 91
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }
    else:  # Default
        decision_replay = [
            {"step": "Financial Signals Collected", "timestamp": "10:00 AM", "explanation": "Verified user accounts status and recent transaction parameters."},
            {"step": "Pattern Detection", "timestamp": "10:15 AM", "explanation": "Identified periodic spending spikes and surplus thresholds."},
            {"step": "Goal Matching", "timestamp": "10:30 AM", "explanation": "Matched with standard wealth security goal metrics."},
            {"step": "Risk Assessment", "timestamp": "10:45 AM", "explanation": "Calculated low overall volatility exposure boundaries."},
            {"step": "Alternative Evaluation", "timestamp": "11:00 AM", "explanation": f"Compared option '{title}' against standard conservative reserves."},
            {"step": "Customer Benefit Check", "timestamp": "11:15 AM", "explanation": "Verified zero net costs and positive interest optimizations."},
            {"step": "Compliance Review", "timestamp": "11:30 AM", "explanation": "Passed all standard regulatory banking checks."},
            {"step": "Final Recommendation", "timestamp": "11:45 AM", "explanation": f"Advisory finalized for: {title}."}
        ]
        why_not = [
            {"recommendation": f"{title} (Recommended) ⭐", "score": confidence_score, "benefit": "Medium", "risk": "Low", "decision": "Selected"},
            {"recommendation": "Traditional Savings Account", "score": max(50, confidence_score - 20), "benefit": "Low", "risk": "Lowest", "decision": "Lower yield"},
            {"recommendation": "Do Nothing", "score": max(30, confidence_score - 35), "benefit": "Lowest", "risk": "Lowest", "decision": "Inefficiency loss"}
        ]
        agents = [
            {"agent": "Financial Planner", "decision": "Recommend", "reason": "Fits general surplus capital allocations.", "status": "approved"},
            {"agent": "Risk Engine", "decision": "Recommend", "reason": "General credit risk remains low.", "status": "approved"},
            {"agent": "Customer Advocate", "decision": "Recommend", "reason": "Enhances overall client account value.", "status": "approved"},
            {"agent": "Compliance Engine", "decision": "Approved", "reason": "Adheres to fair advisory practices.", "status": "approved"}
        ]
        consensus = "4 / 4 Approved"
        counterfactuals = [
            {"scenario": "Recommended ⭐", "wealth": "Optimized growth", "goal_time": "Accelerated", "risk": "Low", "selected": True},
            {"scenario": "Traditional Allocation", "wealth": "Standard growth", "goal_time": "Delayed", "risk": "Lowest", "selected": False}
        ]
        impact_metrics = {
            "savings": "₹10,000",
            "savings_progress": 50,
            "goal_acceleration": "6 Months Faster",
            "acceleration_progress": 60,
            "risk_reduction": "10%",
            "risk_progress": 65,
            "expected_wealth_growth": "+₹2.0L",
            "wealth_progress": 55
        }
        confidence_breakdown = {
            "income_stability": max(70, confidence_score - 5),
            "savings_behaviour": max(70, confidence_score - 10),
            "debt_capacity": max(70, confidence_score - 8),
            "goal_alignment": max(70, confidence_score - 2),
            "market_conditions": max(70, confidence_score - 12)
        }
        evidence_used = [
            {"category": "Income", "signals": ["Active account status verified"]},
            {"category": "Savings", "signals": ["Positive average cash flow"]},
            {"category": "Goals", "signals": ["Standard savings optimization"]},
            {"category": "Risk", "signals": ["Credit history in good standing"]}
        ]
        trust_evolution = {
            "before": 85,
            "after": 87,
            "change": "+2",
            "reason": "AI recommendation parameters matched dynamically."
        }
        scorecard = {
            "customer_benefit": confidence_score,
            "transparency": 100,
            "financial_risk": "Low",
            "confidence": confidence_score,
            "affordability": max(75, confidence_score - 5)
        }
        benefit_test = {
            "prioritized": True,
            "transparent": True,
            "compliant": True,
            "lower_risk": True,
            "wealth_optimized": True
        }

    return {
        "decision_replay": decision_replay,
        "why_not": why_not,
        "agent_deliberation": {
            "agents": agents,
            "consensus": consensus
        },
        "counterfactuals": counterfactuals,
        "impact_metrics": impact_metrics,
        "confidence_breakdown": confidence_breakdown,
        "evidence_used": evidence_used,
        "trust_evolution": trust_evolution,
        "scorecard": scorecard,
        "identity": {
            "decision_id": f"REC-2026-{10000 + (confidence_score * 77) % 9000}",
            "timestamp": ts_str,
            "model": "IDBI Financial AI",
            "status": "Verified"
        },
        "benefit_test": benefit_test
    }

@router.get("/trust-ledger", response_model=List[AIRecommendationOut])
async def get_trust_ledger(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(TrustLedgerEntry)
        .filter_by(user_id=current_user.id)
        .order_by(TrustLedgerEntry.timestamp.desc())
    )
    entries = result.scalars().all()
    
    for entry in entries:
        explainability = generate_explainability_backend(
            entry.title,
            entry.confidence_score,
            entry.impact or "High",
            entry.timestamp
        )
        
        # Attach explainability field dynamically
        entry.explainability = explainability
        
        # Keep legacy fields populated for backward compatibility
        entry.decision_replay = {
            "financial_signals": [step["step"] for step in explainability["decision_replay"]],
            "analysis_steps": [step["explanation"] for step in explainability["decision_replay"]],
            "alternatives_considered": [opt["recommendation"] for opt in explainability["why_not"]],
            "selected_reason": entry.description
        }
        entry.agent_deliberation = explainability["agent_deliberation"]["agents"]
        entry.counterfactuals = explainability["counterfactuals"]
        entry.impact_metrics = explainability["impact_metrics"]
        
    return entries

# 3. Money Mood
@router.get("/money-mood")
async def get_money_mood(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    accounts = result.scalars().all()
    
    from app.models.models import Transaction
    result_tx = await db.execute(
        select(Transaction)
        .filter(
            or_(
                Transaction.sender_id == current_user.id,
                Transaction.receiver_id == current_user.id,
                Transaction.sender_name == current_user.name,
                Transaction.receiver_name == current_user.name
            )
        )
    )
    transactions = result_tx.scalars().all()
    
    import hashlib
    seed_source = f"{current_user.id}-{current_user.email.lower()}"
    seed_int = int(hashlib.sha256(seed_source.encode()).hexdigest(), 16) % (10**8)
    from app.services.personas import PERSONAS
    persona_keys = list(PERSONAS.keys())
    persona_name = persona_keys[seed_int % len(persona_keys)]
    if current_user.email.lower() == "aarav.sharma@idbi.co.in":
        persona_name = "Experienced Salaried Employee"
        
    from app.services.financial_analytics import FinancialAnalyticsCalculator
    from app.services.money_mood import MoneyMoodEngine
    
    analytics = FinancialAnalyticsCalculator.compute_all_metrics(accounts, transactions, persona_name)
    mood_data = MoneyMoodEngine.evaluate_mood(analytics, transactions)
    return mood_data

@router.get("/money-mood/explain-future-you")
async def explain_future_you(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    accounts = result.scalars().all()
    
    from app.models.models import Transaction
    from sqlalchemy import or_
    result_tx = await db.execute(
        select(Transaction)
        .filter(
            or_(
                Transaction.sender_id == current_user.id,
                Transaction.receiver_id == current_user.id,
                Transaction.sender_name == current_user.name,
                Transaction.receiver_name == current_user.name
            )
        )
    )
    transactions = result_tx.scalars().all()
    
    import hashlib
    seed_source = f"{current_user.id}-{current_user.email.lower()}"
    seed_int = int(hashlib.sha256(seed_source.encode()).hexdigest(), 16) % (10**8)
    from app.services.personas import PERSONAS
    persona_keys = list(PERSONAS.keys())
    persona_name = persona_keys[seed_int % len(persona_keys)]
    if current_user.email.lower() == "aarav.sharma@idbi.co.in":
        persona_name = "Experienced Salaried Employee"
        
    from app.services.financial_analytics import FinancialAnalyticsCalculator
    from app.ai.provider import ai_provider
    from sqlalchemy import or_
    
    analytics = FinancialAnalyticsCalculator.compute_all_metrics(accounts, transactions, persona_name)
    explanation = await ai_provider.generate_future_you_explanation(current_user.name, persona_name, analytics)
    return explanation

# 4. Offers
@router.get("/offers", response_model=List[OfferOut])
async def get_offers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    accounts = result.scalars().all()
    
    from app.models.models import Transaction
    result_tx = await db.execute(
        select(Transaction)
        .filter(
            or_(
                Transaction.sender_id == current_user.id,
                Transaction.receiver_id == current_user.id,
                Transaction.sender_name == current_user.name,
                Transaction.receiver_name == current_user.name
            )
        )
    )
    transactions = result_tx.scalars().all()
    
    import hashlib
    seed_source = f"{current_user.id}-{current_user.email.lower()}"
    seed_int = int(hashlib.sha256(seed_source.encode()).hexdigest(), 16) % (10**8)
    from app.services.personas import PERSONAS
    persona_keys = list(PERSONAS.keys())
    persona_name = persona_keys[seed_int % len(persona_keys)]
    if current_user.email.lower() == "aarav.sharma@idbi.co.in":
        persona_name = "Experienced Salaried Employee"
        
    from app.services.financial_analytics import FinancialAnalyticsCalculator
    analytics = FinancialAnalyticsCalculator.compute_all_metrics(accounts, transactions, persona_name)
    
    result_le = await db.execute(select(LifeEvent).filter_by(user_id=current_user.id))
    life_events = result_le.scalars().all()
    
    from app.services.offer_engine import OfferEngine
    offers = OfferEngine.generate_offers(analytics, life_events, current_user.name)
    return offers

# 5. Notifications
@router.get("/notifications", response_model=List[NotificationOut])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification)
        .filter_by(user_id=current_user.id)
        .order_by(Notification.timestamp.desc())
    )
    return result.scalars().all()

@router.patch("/notifications/read")
async def mark_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Notification).filter_by(user_id=current_user.id, read=False))
    unread_notifications = result.scalars().all()
    for notif in unread_notifications:
        notif.read = True
    await db.commit()
    return {"message": "All notifications marked as read", "count": len(unread_notifications)}

# 6. Settings
@router.get("/settings", response_model=SettingOut)
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Setting).filter_by(user_id=current_user.id))
    setting = result.scalars().first()
    if not setting:
        # Create default setting if missing
        setting = Setting(
            user_id=current_user.id,
            language="English",
            notifications_enabled=True,
            biometrics_enabled=False
        )
        db.add(setting)
        await db.commit()
        await db.refresh(setting)
    return setting

@router.put("/settings", response_model=SettingOut)
async def update_settings(
    setting_in: SettingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Setting).filter_by(user_id=current_user.id))
    setting = result.scalars().first()
    if not setting:
        setting = Setting(user_id=current_user.id)
        db.add(setting)
        
    setting.language = setting_in.language
    setting.notifications_enabled = setting_in.notifications_enabled
    setting.biometrics_enabled = setting_in.biometrics_enabled
    
    await db.commit()
    await db.refresh(setting)
    return setting
