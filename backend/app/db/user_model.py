from sqlalchemy import Column, String, DateTime
from app.db.database import Base
import uuid
from sqlalchemy import Column, DateTime, func
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    avatar_url = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    title = Column(String, nullable=True)
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    last_name = Column(String, nullable=False)
    citizen_id = Column(String(13), nullable=True)
    birth_date = Column(DateTime, nullable=True)
    blood_type = Column(String(3), nullable=True)
    gender = Column(String, nullable=True)
    mobile_no = Column(String, nullable=True)
    address = Column(String, nullable=True)
    username = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=True)
    department = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    created_by = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String, nullable=False)
