from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from sqlalchemy.orm import Session
from app.api.v1.models.Users import User
from app.core.database import SessionLocal
from app.api.v1.schemas.users import UserCreate, UserResponse, LoginRequest
from app.api.v1.crud.auth.users import create_user, authenticate_user, get_user_by_login
from app.api.v1.auth.auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Регистрация пользователя
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_login(db, login=user.login)
    if db_user:
        raise HTTPException(status_code=400, detail="Login already registered")
    new_user = create_user(db, user.dict())
    return new_user

# Авторизация пользователя
@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):
    user_db = authenticate_user(db, user.login, user.password)
    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_db.login}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Защищенный маршрут для проверки токена
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Тестовый маршрут для проверки токена
@router.get("/test-token")
def test_token(current_user: User = Depends(get_current_user)):
    """
    Тестовый маршрут для проверки валидности токена.
    Возвращает информацию о пользователе, если токен действителен.
    """
    return {
        "message": "Token is valid",
        "user_id": current_user.id,
        "username": current_user.username,
        "login": current_user.login,
        "role": current_user.role
    }
