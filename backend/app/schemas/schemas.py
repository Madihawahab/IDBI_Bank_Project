from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenRefreshRequest(BaseModel):
    refresh_token: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class AccountOut(BaseModel):
    id: int
    account_number: str
    balance: float
    account_type: str

    class Config:
        from_attributes = True

class TransactionOut(BaseModel):
    id: int
    sender_id: Optional[int] = None
    receiver_id: Optional[int] = None
    sender_name: str
    receiver_name: str
    amount: float
    type: str
    merchant: Optional[str] = None
    category: str
    timestamp: datetime
    status: str

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    recipient_account: str
    amount: float
    category: Optional[str] = "Transfer"

class BillPaymentCreate(BaseModel):
    bill_type: str  # e.g., "Electricity", "Mobile", "Water"
    amount: float
    biller_name: str

class ScanPayCreate(BaseModel):
    qr_data: str
    amount: float

class LifeEventCreate(BaseModel):
    title: str
    prediction_date: str
    explanation: str
    confidence: Optional[int] = None

class LifeEventOut(BaseModel):
    id: int
    title: str
    confidence: int
    prediction_date: str
    explanation: str

    class Config:
        from_attributes = True

class DecisionReplayStep(BaseModel):
    step: str
    timestamp: str
    explanation: str

    class Config:
        from_attributes = True

class WhyNotOption(BaseModel):
    recommendation: str
    score: int
    benefit: str
    risk: str
    decision: str

    class Config:
        from_attributes = True

class DeliberationAgent(BaseModel):
    agent: str
    decision: str
    reason: str
    status: str

    class Config:
        from_attributes = True

class DeliberationBoard(BaseModel):
    agents: List[DeliberationAgent]
    consensus: str

    class Config:
        from_attributes = True

class CounterfactualScenario(BaseModel):
    scenario: str
    wealth: str
    goal_time: str
    risk: str
    selected: bool

    class Config:
        from_attributes = True

class ImpactMetricsOut(BaseModel):
    savings: str
    savings_progress: int
    goal_acceleration: str
    acceleration_progress: int
    risk_reduction: str
    risk_progress: int
    expected_wealth_growth: str
    wealth_progress: int

    class Config:
        from_attributes = True

class ConfidenceBreakdownOut(BaseModel):
    income_stability: int
    savings_behaviour: int
    debt_capacity: int
    goal_alignment: int
    market_conditions: int

    class Config:
        from_attributes = True

class EvidenceCategoryOut(BaseModel):
    category: str
    signals: List[str]

    class Config:
        from_attributes = True

class TrustEvolutionOut(BaseModel):
    before: int
    after: int
    change: str
    reason: str

    class Config:
        from_attributes = True

class RecommendationScorecardOut(BaseModel):
    customer_benefit: int
    transparency: int
    financial_risk: str
    confidence: int
    affordability: int

    class Config:
        from_attributes = True

class DecisionIdentityOut(BaseModel):
    decision_id: str
    timestamp: str
    model: str
    status: str

    class Config:
        from_attributes = True

class CustomerBenefitTestOut(BaseModel):
    prioritized: bool
    transparent: bool
    compliant: bool
    lower_risk: bool
    wealth_optimized: bool

    class Config:
        from_attributes = True

class ExplainabilityOut(BaseModel):
    decision_replay: List[DecisionReplayStep]
    why_not: List[WhyNotOption]
    agent_deliberation: DeliberationBoard
    counterfactuals: List[CounterfactualScenario]
    impact_metrics: ImpactMetricsOut
    confidence_breakdown: ConfidenceBreakdownOut
    evidence_used: List[EvidenceCategoryOut]
    trust_evolution: TrustEvolutionOut
    scorecard: RecommendationScorecardOut
    identity: DecisionIdentityOut
    benefit_test: CustomerBenefitTestOut

    class Config:
        from_attributes = True

class AIRecommendationOut(BaseModel):
    id: int
    title: str
    description: str
    reasoning: str
    alternative_options: Optional[str]
    impact: Optional[str]
    confidence_score: int
    timestamp: datetime
    
    # Advanced explainability fields
    decision_replay: Optional[Dict] = None
    financial_signals: Optional[List[str]] = None
    analysis_steps: Optional[List[str]] = None
    alternatives_considered: Optional[List[str]] = None
    selected_reason: Optional[str] = None
    agent_deliberation: Optional[List[Dict]] = None
    counterfactuals: Optional[List[Dict]] = None
    impact_metrics: Optional[Dict] = None
    explainability: Optional[ExplainabilityOut] = None

    class Config:
        from_attributes = True

class OfferOut(BaseModel):
    id: int
    title: str
    description: str
    eligibility: str
    headline: str
    savings: str
    reasoning: str
    confidence_score: int
    cta_text: str

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    read: bool
    timestamp: datetime

    class Config:
        from_attributes = True

class SettingOut(BaseModel):
    language: str
    notifications_enabled: bool
    biometrics_enabled: bool

    class Config:
        from_attributes = True

class SettingUpdate(BaseModel):
    language: str
    notifications_enabled: bool
    biometrics_enabled: bool

class DashboardOut(BaseModel):
    balance: float
    accounts: List[AccountOut]
    recent_transactions: List[TransactionOut]
    quick_actions: List[dict]
    ai_insight: Optional[AIRecommendationOut]
    upcoming_life_event: Optional[LifeEventOut]
    notifications: List[NotificationOut]

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
