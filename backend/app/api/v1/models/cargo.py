from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Date, Text, CheckConstraint, \
    UniqueConstraint, Index, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Period(Base):
    __tablename__ = "periods"

    period_id = Column(Integer, primary_key=True)
    period_name = Column(String(4), nullable=False, unique=True)

    # Отношения
    batches = relationship("Batch", back_populates="period", cascade="all, delete-orphan")

    # Ограничения
    __table_args__ = (
        CheckConstraint("period_name ~ '^[0-9]{4}$'", name="periods_period_name_check"),
    )


class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True)
    batch_number = Column(String(20), nullable=False)
    period_id = Column(Integer, ForeignKey("periods.period_id", ondelete="RESTRICT"), nullable=False)
    is_active = Column(Boolean, nullable=False, server_default=text("TRUE"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    # Отношения
    period = relationship("Period", back_populates="batches")
    cargo_places = relationship("CargoPlace", back_populates="batch", cascade="all, delete-orphan")

    # Ограничения
    __table_args__ = (
        CheckConstraint("batch_number ~ '^[A-Z]{2}-[0-9]{3}-[0-9]{4}$'", name="check_batch_number_format"),
        UniqueConstraint("batch_number", "period_id", name="uq_batch_number_period"),
        Index("idx_batches_batch_number", batch_number),
        Index("idx_batches_period_id", period_id),
    )


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    code = Column(String(10), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    address = Column(String(255))
    phone = Column(String(20))
    email = Column(String(100))
    contact_person = Column(String(100))
    is_active = Column(Boolean, nullable=False, server_default=text("TRUE"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    # Отношения
    recipients = relationship("Recipient", back_populates="client", cascade="all, delete-orphan")
    cargo_places = relationship("CargoPlace", back_populates="client")

    # Ограничения и индексы
    __table_args__ = (
        CheckConstraint("code ~ '^[A-Z0-9]{3,10}$'", name="check_client_code_format"),
        Index("idx_clients_code", code),
        Index("idx_clients_name", name),
    )


class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(20))
    email = Column(String(100))
    contact_person = Column(String(100))
    is_active = Column(Boolean, nullable=False, server_default=text("TRUE"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    # Отношения
    client = relationship("Client", back_populates="recipients")
    cargo_places = relationship("CargoPlace", back_populates="recipient")

    # Индексы
    __table_args__ = (
        Index("idx_recipients_client_id", client_id),
        Index("idx_recipients_name", name),
    )


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    license_number = Column(String(20), nullable=False, unique=True)
    vehicle_info = Column(String(255))
    is_active = Column(Boolean, nullable=False, server_default=text("TRUE"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    # Отношения
    cargo_places = relationship("CargoPlace", back_populates="driver")

    # Индексы
    __table_args__ = (
        Index("idx_drivers_name", name),
        Index("idx_drivers_license_number", license_number),
    )


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text)
    is_active = Column(Boolean, nullable=False, server_default=text("TRUE"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    # Отношения
    cargo_places = relationship("CargoPlace", back_populates="payment_method")

    # Индексы
    __table_args__ = (
        Index("idx_payment_methods_name", name),
    )


class CargoPlace(Base):
    __tablename__ = "cargo_places"

    id = Column(Integer, primary_key=True)
    tracking_number = Column(String(20), nullable=False, unique=True)
    batch_id = Column(Integer, ForeignKey("batches.id", ondelete="SET NULL"))
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="SET NULL"))
    recipient_id = Column(Integer, ForeignKey("recipients.id", ondelete="SET NULL"))
    driver_id = Column(Integer, ForeignKey("drivers.id", ondelete="SET NULL"))
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id", ondelete="SET NULL"))

    # Основная информация о грузе
    status = Column(String(50), nullable=False, server_default=text("'Создан'"))
    weight = Column(Float, nullable=False, server_default=text("0"))
    volume = Column(Float, nullable=False, server_default=text("0"))
    declared_value = Column(Float, nullable=False, server_default=text("0"))
    shipping_cost = Column(Float, nullable=False, server_default=text("0"))

    # Даты
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    departure_date = Column(Date)
    estimated_arrival_date = Column(Date)
    actual_arrival_date = Column(Date)

    # Дополнительная информация
    description = Column(Text)
    notes = Column(Text)
    is_fragile = Column(Boolean, nullable=False, server_default=text("FALSE"))
    is_oversized = Column(Boolean, nullable=False, server_default=text("FALSE"))
    priority = Column(String(20), nullable=False, server_default=text("'Обычный'"))

    # Флаги
    is_paid = Column(Boolean, nullable=False, server_default=text("FALSE"))
    is_delivered = Column(Boolean, nullable=False, server_default=text("FALSE"))
    is_active = Column(Boolean, nullable=False, server_default=text("TRUE"))

    # Отношения
    batch = relationship("Batch", back_populates="cargo_places")
    client = relationship("Client", back_populates="cargo_places")
    recipient = relationship("Recipient", back_populates="cargo_places")
    driver = relationship("Driver", back_populates="cargo_places")
    payment_method = relationship("PaymentMethod", back_populates="cargo_places")

    # Исправляем отношение, указывая конкретные внешние ключи
    composite_places = relationship(
        "CompositePlace",
        back_populates="cargo_place",
        cascade="all, delete-orphan",
        foreign_keys="CompositePlace.cargo_place_id"
    )

    parent_composite_places = relationship(
        "CompositePlace",
        cascade="all, delete-orphan",
        foreign_keys="CompositePlace.parent_id"
    )

    # Ограничения и индексы
    __table_args__ = (
        CheckConstraint("tracking_number ~ '^[A-Z]{3}-[0-9]{6}-[0-9]{2}$'", name="check_tracking_number_format"),
        CheckConstraint("status IN ('Создан', 'Ожидает отправки', 'В пути', 'Доставлен', 'Отменен')",
                        name="check_status_values"),
        CheckConstraint("priority IN ('Обычный', 'Важный', 'Срочный')", name="check_priority_values"),
        Index("idx_cargo_places_tracking_number", tracking_number),
        Index("idx_cargo_places_batch_id", batch_id),
        Index("idx_cargo_places_client_id", client_id),
        Index("idx_cargo_places_recipient_id", recipient_id),
        Index("idx_cargo_places_status", status),
        Index("idx_cargo_places_departure_date", departure_date),
        Index("idx_cargo_places_estimated_arrival_date", estimated_arrival_date),
    )


class CompositePlace(Base):
    __tablename__ = "composite_places"

    id = Column(Integer, primary_key=True)
    cargo_place_id = Column(Integer, ForeignKey("cargo_places.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(Integer, ForeignKey("cargo_places.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False, server_default=text("1"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    # Отношения с явным указанием внешних ключей
    cargo_place = relationship(
        "CargoPlace",
        foreign_keys=[cargo_place_id],
        back_populates="composite_places"
    )

    parent = relationship(
        "CargoPlace",
        foreign_keys=[parent_id],
        back_populates="parent_composite_places"
    )

    # Ограничения и индексы
    __table_args__ = (
        CheckConstraint("cargo_place_id != parent_id", name="check_different_cargo_places"),
        CheckConstraint("quantity > 0", name="check_positive_quantity"),
        UniqueConstraint("cargo_place_id", "parent_id", name="uq_composite_place"),
        Index("idx_composite_places_cargo_place_id", cargo_place_id),
        Index("idx_composite_places_parent_id", parent_id),
    )
