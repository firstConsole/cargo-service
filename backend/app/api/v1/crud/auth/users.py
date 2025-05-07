from sqlalchemy.orm import Session
from app.api.v1.models.Users import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Создание пользователя
def create_user(db: Session, user_data: dict):
    hashed_password = pwd_context.hash(user_data["password"])
    db_user = User(
        username=user_data["username"],
        login=user_data["login"],
        password_hash=hashed_password,
        role=user_data.get("role", "user"),
        is_active=user_data.get("is_active", True)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Получение пользователя по логину
def get_user_by_login(db: Session, login: str):
    return db.query(User).filter(User.login == login).first()

# Проверка пароля
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Аутентификация пользователя
def authenticate_user(db: Session, login: str, password: str):
    user = get_user_by_login(db, login)
    if not user or not verify_password(password, user.password_hash):
        return False
    return user
