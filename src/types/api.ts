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
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  eligibility: string;
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
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
