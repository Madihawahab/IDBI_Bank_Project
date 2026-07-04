from pydantic import BaseModel
from typing import List, Optional

class DetailedInfo(BaseModel):
    signals: List[str]
    reasoning: str
    alternatives: str
    confidence: int
    humanReview: bool

class ChatResponse(BaseModel):
    reply: str
    detailed: Optional[DetailedInfo] = None
