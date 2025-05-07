from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.v1.models.cargo import Period
from app.api.v1.schemas.cargo import PeriodCreate, PeriodUpdate


def get_period(db: Session, period_id: int) -> Optional[Period]:
    return db.query(Period).filter(Period.period_id == period_id).first()


def get_period_by_name(db: Session, name: str) -> Optional[Period]:
    return db.query(Period).filter(Period.period_name == name).first()


def get_periods(
        db: Session,
        skip: int = 0,
        limit: int = 100
) -> List[Period]:
    query = db.query(Period)
    return query.offset(skip).limit(limit).all()


def create_period(db: Session, period: PeriodCreate) -> Period:
    db_period = Period(period_name=period.period_name)
    db.add(db_period)
    db.commit()
    db.refresh(db_period)
    return db_period


def update_period(db: Session, period_id: int, period: PeriodUpdate) -> Optional[Period]:
    db_period = get_period(db, period_id)
    if db_period is None:
        return None

    update_data = period.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_period, key, value)

    db.commit()
    db.refresh(db_period)
    return db_period


def delete_period(db: Session, period_id: int) -> bool:
    db_period = get_period(db, period_id)
    if db_period is None:
        return False

    db.delete(db_period)
    db.commit()
    return True
