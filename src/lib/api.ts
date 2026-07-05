import axios from "axios";
import {
  User,
  Account,
  Transaction,
  LifeEvent,
  AIRecommendation,
  Offer,
  Notification,
  Settings,
  DashboardData,
  ChatResponse,
  MoneyMood,
  TokenResponse,
} from "../types/api";

// Read API URL from environment or default to port 8000
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          try {
            // Request new tokens using standard axios (to prevent interceptor loop)
            const { data } = await axios.post<TokenResponse>(`${API_URL}/auth/refresh`, {
              refresh_token: refreshToken,
            });

            // Save new tokens
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token available - redirect to login
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Centralized API modules

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<TokenResponse> => {
    const { data } = await api.post<TokenResponse>("/auth/login", credentials);
    return data;
  },
  logout: async (): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>("/auth/logout");
    return data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
  register: async (user: Record<string, string>): Promise<User> => {
    const { data } = await api.post<User>("/auth/register", user);
    return data;
  },
};

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  },
};

export const transactionsApi = {
  getTransactions: async (q?: string): Promise<Transaction[]> => {
    const { data } = await api.get<Transaction[]>("/transactions", {
      params: q ? { q } : undefined,
    });
    return data;
  },
  transfer: async (payload: {
    recipient_account: string;
    amount: number;
    category?: string;
  }): Promise<Transaction> => {
    const { data } = await api.post<Transaction>("/transfer", payload);
    return data;
  },
  payBill: async (payload: {
    bill_type: string;
    biller_name: string;
    amount: number;
  }): Promise<Transaction> => {
    const { data } = await api.post<Transaction>("/pay-bill", payload);
    return data;
  },
  scanPay: async (payload: { qr_data: string; amount: number }): Promise<Transaction> => {
    const { data } = await api.post<Transaction>("/scan-pay", payload);
    return data;
  },
};

export const aiAdvisorApi = {
  chat: async (message: string): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>("/chat", { message });
    return data;
  },
  resetChat: async (): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>("/chat/reset");
    return data;
  },
};

export const lifeEventsApi = {
  getLifeEvents: async (): Promise<LifeEvent[]> => {
    const { data } = await api.get<LifeEvent[]>("/life-events");
    return data;
  },
  createLifeEvent: async (payload: {
    title: string;
    confidence?: number;
    prediction_date: string;
    explanation: string;
  }): Promise<LifeEvent> => {
    const { data } = await api.post<LifeEvent>("/life-events", payload);
    return data;
  },
};

export const trustLedgerApi = {
  getTrustLedger: async (): Promise<AIRecommendation[]> => {
    const { data } = await api.get<AIRecommendation[]>("/trust-ledger");
    return data;
  },
};

export const moneyMoodApi = {
  getMoneyMood: async (): Promise<MoneyMood> => {
    const { data } = await api.get<MoneyMood>("/money-mood");
    return data;
  },
};

export const offersApi = {
  getOffers: async (): Promise<Offer[]> => {
    const { data } = await api.get<Offer[]>("/offers");
    return data;
  },
};

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const { data } = await api.get<Settings>("/settings");
    return data;
  },
  updateSettings: async (settings: {
    language: string;
    notifications_enabled: boolean;
    biometrics_enabled: boolean;
  }): Promise<Settings> => {
    const { data } = await api.put<Settings>("/settings", settings);
    return data;
  },
};
