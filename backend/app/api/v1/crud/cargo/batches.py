from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.v1.models.cargo import Batch
from app.api.v1.schemas.cargo import BatchCreate, BatchUpdate


def get_batch(db: Session, batch_id: int) -> Optional[Batch]:
    return db.query(Batch).filter(Batch.id == batch_id).first()


def get_batch_by_number(db: Session, batch_number: str, period_id: int) -> Optional[Batch]:
    return db.query(Batch).filter(
        Batch.batch_number == batch_number,
        Batch.period_id == period_id
    ).first()


def get_batches(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        period_id: Optional[int] = None,
        is_active: Optional[bool] = None
) -> List[Batch]:
    query = db.query(Batch)
    if period_id is not None:
        query = query.filter(Batch.period_id == period_id)
    if is_active is not None:
        query = query.filter(Batch.is_active == is_active)
    return query.offset(skip).limit(limit).all()


def create_batch(db: Session, batch: BatchCreate) -> Batch:
    db_batch = Batch(**batch.model_dump())
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch


def update_batch(db: Session, batch_id: int, batch: BatchUpdate) -> Optional[Batch]:
    db_batch = get_batch(db, batch_id)
    if db_batch is None:
        return None

    update_data = batch.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_batch, key, value)

    db.commit()
    db.refresh(db_batch)
    return db_batch


def delete_batch(db: Session, batch_id: int) -> bool:
    db_batch = get_batch(db, batch_id)
    if db_batch is None:
        return False

    db.delete(db_batch)
    db.commit()
    return True
