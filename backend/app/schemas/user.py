from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    display_name: Optional[str]
    avatar_url: Optional[str] = None
    title: Optional[str]
    first_name: str
    middle_name: Optional[str]
    last_name: str
    citizen_id: Optional[str]
    birth_date: Optional[datetime]
    blood_type: Optional[str]
    gender: Optional[str]
    mobile_no: Optional[str]
    address: Optional[str]
    username: str
    email: EmailStr
    role: Optional[str]
    department: Optional[str]

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserOut(UserBase):
    id: str
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True

