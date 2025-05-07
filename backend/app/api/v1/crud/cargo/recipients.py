from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.v1.models.cargo import Recipient
from app.api.v1.schemas.cargo import RecipientCreate, RecipientUpdate


def get_recipient(db: Session, recipient_id: int) -> Optional[Recipient]:
    return db.query(Recipient).filter(Recipient.id == recipient_id).first()


def get_recipients(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        client_id: Optional[int] = None,
        is_active: Optional[bool] = None
) -> List[Recipient]:
    query = db.query(Recipient)
    if client_id is not None:
        query = query.filter(Recipient.client_id == client_id)
    if is_active is not None:
        query = query.filter(Recipient.is_active == is_active)
    return query.offset(skip).limit(limit).all()


def create_recipient(db: Session, recipient: RecipientCreate) -> Recipient:
    db_recipient = Recipient(**recipient.model_dump())
    db.add(db_recipient)
    db.commit()
    db.refresh(db_recipient)
    return db_recipient


def update_recipient(db: Session, recipient_id: int, recipient: RecipientUpdate) -> Optional[Recipient]:
    db_recipient = get_recipient(db, recipient_id)
    if db_recipient is None:
        return None

    update_data = recipient.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_recipient, key, value)

    db.commit()
    db.refresh(db_recipient)
    return db_recipient


def delete_recipient(db: Session, recipient_id: int) -> bool:
    db_recipient = get_recipient(db, recipient_id)
    if db_recipient is None:
        return False

    db.delete(db_recipient)
    db.commit()
    return True
