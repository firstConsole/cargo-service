from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.auth.auth import router as auth_router
from app.api.v1.endpoints.cargo.periods import router as periods_router
from app.api.v1.endpoints.cargo.excel import router as excel_router

app = FastAPI(title="Cargo Service API", version="1.0.0")

# Настройка CORS - расширяем список разрешенных источников
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(periods_router, prefix="/api/v1/periods", tags=["periods"])
app.include_router(excel_router, prefix="/api/v1/excel", tags=["excel"])

@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в Cargo Service API"}
