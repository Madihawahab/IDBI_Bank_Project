export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  created_at: string;
}

export interface Account {
  id: number;
  user_id: number;
  account_number: string;
  balance: number;
  account_type: string;
}

export interface Transaction {
  id: number;
  sender_id?: number;
  receiver_id?: number;
  sender_name: string;
  receiver_name: string;
  amount: number;
  type: string; // 'transfer', 'pay-bill', 'scan-pay'
  merchant?: string;
  category: string;
  timestamp: string;
  status: string;
}

export interface LifeEvent {
  id: number;
  user_id: number;
  title: string;
  confidence: number;
  prediction_date: string;
  explanation: string;
  alternative_options?: string;
  future_projection?: string;
}

export interface DecisionReplayStep {
  step: string;
  timestamp: string;
  explanation: string;
}

export interface WhyNotOption {
  recommendation: string;
  score: number;
  benefit: string;
  risk: string;
  decision: string;
}

export interface DeliberationAgent {
  agent: string;
  decision: string;
  reason: string;
  status: string;
}

export interface DeliberationBoard {
  agents: DeliberationAgent[];
  consensus: string;
}

export interface CounterfactualScenario {
  scenario: string;
  wealth: string;
  goal_time: string;
  risk: string;
  selected: boolean;
}

export interface ImpactMetrics {
  savings: string;
  savings_progress: number;
  goal_acceleration: string;
  acceleration_progress: number;
  risk_reduction: string;
  risk_progress: number;
  expected_wealth_growth: string;
  wealth_progress: number;
}

export interface ConfidenceBreakdown {
  income_stability: number;
  savings_behaviour: number;
  debt_capacity: number;
  goal_alignment: number;
  market_conditions: number;
}

export interface EvidenceCategory {
  category: string;
  signals: string[];
}

export interface TrustEvolution {
  before: number;
  after: number;
  change: string;
  reason: string;
}

export interface RecommendationScorecard {
  customer_benefit: number;
  transparency: number;
  financial_risk: string;
  confidence: number;
  affordability: number;
}

export interface DecisionIdentity {
  decision_id: string;
  timestamp: string;
  model: string;
  status: string;
}

export interface CustomerBenefitTest {
  prioritized: boolean;
  transparent: boolean;
  compliant: boolean;
  lower_risk: boolean;
  wealth_optimized: boolean;
}

export interface Explainability {
  decision_replay: DecisionReplayStep[];
  why_not: WhyNotOption[];
  agent_deliberation: DeliberationBoard;
  counterfactuals: CounterfactualScenario[];
  impact_metrics: ImpactMetrics;
  confidence_breakdown: ConfidenceBreakdown;
  evidence_used: EvidenceCategory[];
  trust_evolution: TrustEvolution;
  scorecard: RecommendationScorecard;
  identity: DecisionIdentity;
  benefit_test: CustomerBenefitTest;
}

export interface AIRecommendation {
  id: number;
  user_id: number;
  title: string;
  description: string;
  reasoning: string;
  alternative_options?: string;
  impact?: string;
  confidence_score: number;
  timestamp: string;
  explainability?: Explainability;

  // Advanced legacy fields for backwards compatibility
  decision_replay?: {
    financial_signals: string[];
    analysis_steps: string[];
    alternatives_considered: string[];
    selected_reason: string;
  };
  financial_signals?: string[];
  analysis_steps?: string[];
  alternatives_considered?: string[];
  selected_reason?: string;
  agent_deliberation?: {
    agent: string;
    message: string;
    badge_color?: string;
  }[];
  counterfactuals?: {
    scenario: string;
    wealth: string;
    duration: string;
    type: "current" | "alternative";
  }[];
  impact_metrics?: {
    savings: string;
    acceleration: string;
    risk_reduction: string;
    wealth_growth: string;
    savings_val: number;
    risk_val: number;
  };
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  eligibility: string;
  headline: string;
  savings: string;
  reasoning: string;
  confidence_score: number;
  cta_text: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface Settings {
  id: number;
  user_id: number;
  language: string;
  notifications_enabled: boolean;
  biometrics_enabled: boolean;
}

export interface DashboardData {
  balance: number;
  accounts: Account[];
  recent_transactions: Transaction[];
  quick_actions: { icon: string; label: string }[];
  ai_insight: AIRecommendation | null;
  upcoming_life_event: LifeEvent | null;
  notifications: Notification[];
}

export interface DetailedInfo {
  signals: string[];
  reasoning: string;
  alternatives: string;
  confidence: number;
  humanReview?: boolean;
}

export interface ChatResponse {
  reply: string;
  detailed: DetailedInfo | null;
}

export interface MoodDataPoint {
  name: string;
  amount: number;
}

export interface MoneyMood {
  savings: MoodDataPoint[];
  spending: MoodDataPoint[];
  investment: MoodDataPoint[];
  mood_score: number;
  mood_label?: string;
  personalized_insight?: string;
  positive_habits?: string[];
  watch_out?: string[];
  future_you_title?: string;
  future_you_desc?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
