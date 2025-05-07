from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.v1.models.cargo import Client
from app.api.v1.schemas.cargo import ClientCreate, ClientUpdate


def get_client(db: Session, client_id: int) -> Optional[Client]:
    return db.query(Client).filter(Client.id == client_id).first()


def get_client_by_code(db: Session, code: str) -> Optional[Client]:
    return db.query(Client).filter(Client.code == code).first()


def get_clients(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        is_active: Optional[bool] = None
) -> List[Client]:
    query = db.query(Client)
    if is_active is not None:
        query = query.filter(Client.is_active == is_active)
    return query.offset(skip).limit(limit).all()


def create_client(db: Session, client: ClientCreate) -> Client:
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


def update_client(db: Session, client_id: int, client: ClientUpdate) -> Optional[Client]:
    db_client = get_client(db, client_id)
    if db_client is None:
        return None

    update_data = client.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_client, key, value)

    db.commit()
    db.refresh(db_client)
    return db_client


def delete_client(db: Session, client_id: int) -> bool:
    db_client = get_client(db, client_id)
    if db_client is None:
        return False

    db.delete(db_client)
    db.commit()
    return True
