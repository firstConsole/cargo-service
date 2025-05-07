from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import SessionLocal
from app.api.v1.schemas.cargo import PeriodCreate, PeriodUpdate, PeriodResponse
from app.api.v1.crud.cargo.periods import (
    get_period,
    get_period_by_name,
    get_periods,
    create_period,
    update_period,
    delete_period
)
from app.api.v1.auth.auth import get_current_user
from app.api.v1.models.Users import User

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=PeriodResponse, status_code=status.HTTP_201_CREATED)
def create_period_endpoint(
        period: PeriodCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        local_kw: Optional[str] = Query(None, description="Локальный ключевой параметр (необязательный)")
):
    """
    Создает новый период.

    - **period_name**: Название периода (год, например "2024")
    """
    # Проверяем, существует ли период с таким названием
    db_period = get_period_by_name(db, name=period.period_name)
    if db_period:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Период с таким названием уже существует"
        )

    # Создаем новый период
    return create_period(db=db, period=period)


@router.get("/", response_model=List[PeriodResponse])
def read_periods(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        local_kw: Optional[str] = Query(None, description="Локальный ключевой параметр (необязательный)")
):
    """
    Получает список периодов.

    - **skip**: Количество записей для пропуска (пагинация)
    - **limit**: Максимальное количество записей для возврата
    """
    periods = get_periods(db, skip=skip, limit=limit)
    return periods


@router.get("/{period_id}", response_model=PeriodResponse)
def read_period(
        period_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        local_kw: Optional[str] = Query(None, description="Локальный ключевой параметр (необязательный)")
):
    """
    Получает информацию о конкретном периоде по его ID.

    - **period_id**: ID периода
    """
    db_period = get_period(db, period_id=period_id)
    if db_period is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Период не найден")
    return db_period


@router.put("/{period_id}", response_model=PeriodResponse)
def update_period_endpoint(
        period_id: int,
        period: PeriodUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        local_kw: Optional[str] = Query(None, description="Локальный ключевой параметр (необязательный)")
):
    """
    Обновляет информацию о периоде.

    - **period_id**: ID периода для обновления
    - **period_name**: Новое название периода (опционально)
    """
    db_period = update_period(db, period_id=period_id, period=period)
    if db_period is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Период не найден")
    return db_period


@router.delete("/{period_id}", response_model=dict)
def delete_period_endpoint(
        period_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        local_kw: Optional[str] = Query(None, description="Локальный ключевой параметр (необязательный)")
):
    """
    Удаляет период.

    - **period_id**: ID периода для удаления
    """
    success = delete_period(db, period_id=period_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Период не найден")
    return {"success": True, "message": "Период успешно удален"}
