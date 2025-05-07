from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, Dict, Any
from datetime import date, datetime
import re

# Базовые схемы для общих полей
class TimestampMixin(BaseModel):
    created_at: datetime = None

    class Config:
        from_attributes = True

class StatusMixin(BaseModel):
    is_active: bool = True

# Схемы для периодов
class PeriodBase(BaseModel):
    period_name: str = Field(..., min_length=4, max_length=4)

    @validator('period_name')
    def validate_period_name(cls, v):
        if not re.match(r'^[0-9]{4}$', v):
            raise ValueError('Неверный формат года. Должен быть 4 цифры.')
        return v

class PeriodCreate(PeriodBase):
    pass

class PeriodUpdate(BaseModel):
    period_name: Optional[str] = Field(None, min_length=4, max_length=4)

    @validator('period_name')
    def validate_period_name(cls, v):
        if v is not None and not re.match(r'^[0-9]{4}$', v):
            raise ValueError('Неверный формат года. Должен быть 4 цифры.')
        return v

class PeriodResponse(PeriodBase):
    period_id: int

    class Config:
        from_attributes = True

# Схемы для партий
class BatchBase(BaseModel):
    batch_number: str = Field(..., min_length=9, max_length=20)
    period_id: int

    @validator('batch_number')
    def validate_batch_number(cls, v):
        if not re.match(r'^[A-Z]{2}-[0-9]{3}-[0-9]{4}$', v):
            raise ValueError('Неверный формат номера партии. Должен быть в формате XX-000-0000')
        return v

class BatchCreate(BatchBase, StatusMixin):
    pass

class BatchUpdate(BaseModel):
    batch_number: Optional[str] = Field(None, min_length=9, max_length=20)
    period_id: Optional[int] = None
    is_active: Optional[bool] = None

    @validator('batch_number')
    def validate_batch_number(cls, v):
        if v is not None and not re.match(r'^[A-Z]{2}-[0-9]{3}-[0-9]{4}$', v):
            raise ValueError('Неверный формат номера партии. Должен быть в формате XX-000-0000')
        return v

class BatchResponse(BatchBase, StatusMixin, TimestampMixin):
    id: int
    period: Optional[Dict[str, Any]] = None

# Схемы для клиентов
class ClientBase(BaseModel):
    code: str = Field(..., min_length=3, max_length=10)
    name: str = Field(..., min_length=1, max_length=255)
    address: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    contact_person: Optional[str] = Field(None, max_length=100)

    @validator('code')
    def validate_code(cls, v):
        if not re.match(r'^[A-Z0-9]{3,10}$', v):
            raise ValueError('Неверный формат кода клиента. Должен содержать только заглавные буквы и цифры, длина от 3 до 10 символов')
        return v

class ClientCreate(ClientBase, StatusMixin):
    pass

class ClientUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=3, max_length=10)
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    address: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    contact_person: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None

    @validator('code')
    def validate_code(cls, v):
        if v is not None and not re.match(r'^[A-Z0-9]{3,10}$', v):
            raise ValueError('Неверный формат кода клиента. Должен содержать только заглавные буквы и цифры, длина от 3 до 10 символов')
        return v

class ClientResponse(ClientBase, StatusMixin, TimestampMixin):
    id: int

# Схемы для получателей
class RecipientBase(BaseModel):
    client_id: int
    name: str = Field(..., min_length=1, max_length=255)
    address: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    contact_person: Optional[str] = Field(None, max_length=100)

class RecipientCreate(RecipientBase, StatusMixin):
    pass

class RecipientUpdate(BaseModel):
    client_id: Optional[int] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    address: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    contact_person: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None

class RecipientResponse(RecipientBase, StatusMixin, TimestampMixin):
    id: int
    client: Optional[Dict[str, Any]] = None

# Схемы для водителей
class DriverBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=1, max_length=20)
    license_number: str = Field(..., min_length=1, max_length=20)
    vehicle_info: Optional[str] = Field(None, max_length=255)

class DriverCreate(DriverBase, StatusMixin):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=1, max_length=20)
    license_number: Optional[str] = Field(None, min_length=1, max_length=20)
    vehicle_info: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None

class DriverResponse(DriverBase, StatusMixin, TimestampMixin):
    id: int

# Схемы для способов оплаты
class PaymentMethodBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None

class PaymentMethodCreate(PaymentMethodBase, StatusMixin):
    pass

class PaymentMethodUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = None

class PaymentMethodResponse(PaymentMethodBase, StatusMixin, TimestampMixin):
    id: int

# Схемы для грузовых мест
class CargoPlaceBase(BaseModel):
    tracking_number: str = Field(..., min_length=12, max_length=20)
    batch_id: Optional[int] = None
    client_id: Optional[int] = None
    recipient_id: Optional[int] = None
    driver_id: Optional[int] = None
    payment_method_id: Optional[int] = None
    status: str = Field("Создан", min_length=1, max_length=50)
    weight: float = Field(0, ge=0)
    volume: float = Field(0, ge=0)
    declared_value: float = Field(0, ge=0)
    shipping_cost: float = Field(0, ge=0)
    departure_date: Optional[date] = None
    estimated_arrival_date: Optional[date] = None
    actual_arrival_date: Optional[date] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    is_fragile: bool = False
    is_oversized: bool = False
    priority: str = Field("Обычный", min_length=1, max_length=20)
    is_paid: bool = False
    is_delivered: bool = False

    @validator('tracking_number')
    def validate_tracking_number(cls, v):
        if not re.match(r'^[A-Z]{3}-[0-9]{6}-[0-9]{2}$', v):
            raise ValueError('Неверный формат номера отслеживания. Должен быть в формате XXX-000000-00')
        return v

    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['Создан', 'Ожидает отправки', 'В пути', 'Доставлен', 'Отменен']
        if v not in valid_statuses:
            raise ValueError(f'Неверный статус. Допустимые значения: {", ".join(valid_statuses)}')
        return v

    @validator('priority')
    def validate_priority(cls, v):
        valid_priorities = ['Обычный', 'Важный', 'Срочный']
        if v not in valid_priorities:
            raise ValueError(f'Неверный приор����тет. Допустимые значения: {", ".join(valid_priorities)}')
        return v

class CargoPlaceCreate(CargoPlaceBase, StatusMixin):
    pass

class CargoPlaceUpdate(BaseModel):
    tracking_number: Optional[str] = Field(None, min_length=12, max_length=20)
    batch_id: Optional[int] = None
    client_id: Optional[int] = None
    recipient_id: Optional[int] = None
    driver_id: Optional[int] = None
    payment_method_id: Optional[int] = None
    status: Optional[str] = Field(None, min_length=1, max_length=50)
    weight: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)
    declared_value: Optional[float] = Field(None, ge=0)
    shipping_cost: Optional[float] = Field(None, ge=0)
    departure_date: Optional[date] = None
    estimated_arrival_date: Optional[date] = None
    actual_arrival_date: Optional[date] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    is_fragile: Optional[bool] = None
    is_oversized: Optional[bool] = None
    priority: Optional[str] = Field(None, min_length=1, max_length=20)
    is_paid: Optional[bool] = None
    is_delivered: Optional[bool] = None
    is_active: Optional[bool] = None

    @validator('tracking_number')
    def validate_tracking_number(cls, v):
        if v is not None and not re.match(r'^[A-Z]{3}-[0-9]{6}-[0-9]{2}$', v):
            raise ValueError('Неверный формат номера отслеживания. Должен быть в формате XXX-000000-00')
        return v

    @validator('status')
    def validate_status(cls, v):
        if v is not None:
            valid_statuses = ['Создан', 'Ожидает отправки', 'В пути', 'Доставлен', 'Отменен']
            if v not in valid_statuses:
                raise ValueError(f'Неверный статус. Допустимые значения: {", ".join(valid_statuses)}')
        return v

    @validator('priority')
    def validate_priority(cls, v):
        if v is not None:
            valid_priorities = ['Обычный', 'Важный', 'Срочный']
            if v not in valid_priorities:
                raise ValueError(f'Неверный приоритет. Допустимые значения: {", ".join(valid_priorities)}')
        return v

class CargoPlaceResponse(CargoPlaceBase, StatusMixin, TimestampMixin):
    id: int
    batch: Optional[Dict[str, Any]] = None
    client: Optional[Dict[str, Any]] = None
    recipient: Optional[Dict[str, Any]] = None
    driver: Optional[Dict[str, Any]] = None
    payment_method: Optional[Dict[str, Any]] = None

# Схемы для сборных мест
class CompositePlaceBase(BaseModel):
    cargo_place_id: int
    parent_id: int
    quantity: int = Field(1, gt=0)

class CompositePlaceCreate(CompositePlaceBase):
    pass

class CompositePlaceUpdate(BaseModel):
    cargo_place_id: Optional[int] = None
    parent_id: Optional[int] = None
    quantity: Optional[int] = Field(None, gt=0)

class CompositePlaceResponse(CompositePlaceBase, TimestampMixin):
    id: int
    cargo_place: Optional[Dict[str, Any]] = None
    parent: Optional[Dict[str, Any]] = None
