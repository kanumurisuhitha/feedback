from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    manager_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    manager_id: Optional[int]
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginInput(BaseModel):
    email: EmailStr
    password: str
    manager_secret: Optional[str] = None  # 🔥 New field

class FeedbackCreate(BaseModel):
    strengths: str
    improvements: str
    sentiment: str
    employee_id: int
    manager_id: int
    anonymous: Optional[bool] = False
    tags: Optional[str] = ""

class FeedbackOut(BaseModel):
    id: int
    manager_id: int
    employee_id: int
    strengths: str
    improvements: str
    sentiment: str
    anonymous: Optional[bool]
    tags: Optional[str]
    response_text: Optional[str]
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class FeedbackResponse(BaseModel):
    text: str

class FeedbackRequestCreate(BaseModel):
    employee_id: int
    manager_id: int
    reason: str

class FeedbackRequestOut(FeedbackRequestCreate):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class FeedbackCommentCreate(BaseModel):
    feedback_id: int
    user_id: int
    comment: str
class ManagerSecretInput(BaseModel):
    manager_id: int
    manager_secret: str
