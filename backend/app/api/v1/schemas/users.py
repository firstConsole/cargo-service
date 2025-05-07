from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    login: str
    password: str

class UserCreate(BaseModel):
    username: str
    login: str
    password: str
    role: Optional[str] = "user"
    is_active: Optional[bool] = True

class UserResponse(BaseModel):
    id: int
    username: str
    login: str
    role: str
    is_active: bool
    created_at: str
    last_login: Optional[str] = None

    class Config:
        from_attributes = True
