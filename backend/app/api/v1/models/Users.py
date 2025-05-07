from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, text
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False, unique=True)
    login = Column(String(255), unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), server_default="user")
    is_active = Column(Boolean, server_default=text("TRUE"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    last_login = Column(TIMESTAMP(timezone=True))
