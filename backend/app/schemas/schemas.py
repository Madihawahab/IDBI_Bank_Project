from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

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

class AIRecommendationOut(BaseModel):
    id: int
    title: str
    description: str
    reasoning: str
    alternative_options: Optional[str]
    impact: Optional[str]
    confidence_score: int
    timestamp: datetime

    class Config:
        from_attributes = True

class OfferOut(BaseModel):
    id: int
    title: str
    description: str
    eligibility: str

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
