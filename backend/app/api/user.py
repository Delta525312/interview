from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import io
import os
from datetime import datetime
from typing import Optional, Dict, Any
from app.db.database import get_db
from app.db.user_model import User
from app.schemas.user import UserOut
from app.core.minio_config import minio_client, bucket_name
from minio.error import S3Error
from dotenv import load_dotenv

load_dotenv()

# 💡 1. เพิ่มตัวแปรสำหรับ URL ที่จะใช้แทนที่
MINIO_INTERNAL_URL = os.getenv("MINIO_INTERNAL_URL", "http://minio:9000")
MINIO_PUBLIC_URL = os.getenv("MINIO_PUBLIC_URL", "http://localhost:9000")


router = APIRouter(prefix="/api/v1/user", tags=["User"])

def convert_presigned_url_to_public(url: str) -> str:
    if MINIO_INTERNAL_URL in url:
        return url.replace(MINIO_INTERNAL_URL, MINIO_PUBLIC_URL)
    return url

@router.get("/", response_model=Dict[str, Any])
def get_users(
    q: Optional[str] = Query(None, description="Search by name or email"),
    start: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(User)

    # Apply search filter
    if q:
        query = query.filter(
            or_(
                User.first_name.ilike(f"%{q}%"),
                User.last_name.ilike(f"%{q}%"),
                User.display_name.ilike(f"%{q}%"),
                User.username.ilike(f"%{q}%"),
                User.email.ilike(f"%{q}%"),
                User.citizen_id.ilike(f"%{q}%"),
                User.mobile_no.ilike(f"%{q}%"),
                User.address.ilike(f"%{q}%")
            )
        )

    # Sort by created_at (oldest first)
    query = query.order_by(User.created_at.asc())

    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit

    users = query.offset(start).limit(limit).all()

    result = []
    for user in users:
        if user.avatar_url:
            user.avatar_url = f"{MINIO_PUBLIC_URL}/{bucket_name}/{user.avatar_url}"
        result.append(UserOut.from_orm(user))

    return {
        "data": result,
        "total_pages": total_pages
    }



@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.avatar_url:
        user.avatar_url = f"{MINIO_PUBLIC_URL}/{bucket_name}/{user.avatar_url}"

    return user


@router.post("/", response_model=UserOut)
async def create_user(
    first_name: str = Form(...),
    last_name: str = Form(...),
    username: str = Form(...),
    email: str = Form(...),
    # ... พารามิเตอร์อื่นๆ เหมือนเดิม
    citizen_id: Optional[str] = Form(None),
    mobile_no: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    display_name: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    middle_name: Optional[str] = Form(None),
    birth_date: Optional[str] = Form(None),
    blood_type: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # ... โค้ดส่วนต้นเหมือนเดิม
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    avatar_object_name = None
    if file:
        ext = file.filename.split('.')[-1].lower()
        if ext not in ("jpg", "jpeg", "png", "gif"):
            raise HTTPException(status_code=400, detail="Invalid image type")

        # Always use username as object name (overwrite if exists)
        object_name = f"{username}.{ext}"
        contents = await file.read()
        stream = io.BytesIO(contents)

        # Remove old avatar if exists (for create, usually not needed, but safe)
        try:
            minio_client.remove_object(bucket_name, object_name)
        except S3Error:
            pass

        try:
            minio_client.put_object(
                bucket_name=bucket_name, object_name=object_name,
                data=stream, length=len(contents), content_type=file.content_type
            )
            avatar_object_name = object_name
        except S3Error as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {e}")

    birth_date_dt = None
    if birth_date:
        try:
            birth_date_dt = datetime.fromisoformat(birth_date.split('T')[0])
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid birth_date format. Use YYYY-MM-DD.")

    new_user = User(
        first_name=first_name, last_name=last_name, username=username,
        email=email, citizen_id=citizen_id, mobile_no=mobile_no,
        address=address, display_name=display_name, department=department,
        avatar_url=avatar_object_name, title=title, middle_name=middle_name,
        birth_date=birth_date_dt, blood_type=blood_type, gender=gender, created_at=datetime.utcnow(),
        role=role, created_by="admin", updated_by="admin"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if new_user.avatar_url:
        new_user.avatar_url = f"{MINIO_PUBLIC_URL}/{bucket_name}/{new_user.avatar_url}"

    return new_user


@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: str,
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    # ... พารามิเตอร์อื่นๆ เหมือนเดิม
    username: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    citizen_id: Optional[str] = Form(None),
    mobile_no: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    display_name: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    middle_name: Optional[str] = Form(None),
    birth_date: Optional[str] = Form(None),
    blood_type: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # ... โค้ดส่วนต้นและส่วนอัปเดตไฟล์เหมือนเดิม ...
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if email and email != user.email:
        if db.query(User).filter(User.email == email).first():
            raise HTTPException(status_code=400, detail="Email already exists")

    if file:
        ext = file.filename.split('.')[-1].lower()
        if ext not in ("jpg", "jpeg", "png", "gif"):
            raise HTTPException(status_code=400, detail="Invalid image type")

        # Always use user.id as object name (overwrite if exists)
        object_name = f"{user.id}.{ext}"
        contents = await file.read()
        stream = io.BytesIO(contents)

        # Remove old avatar if exists
        if user.avatar_url:
            try:
                minio_client.remove_object(bucket_name, user.avatar_url)
            except S3Error:
                pass

        try:
            minio_client.put_object(
                bucket_name=bucket_name, object_name=object_name,
                data=stream, length=len(contents), content_type=file.content_type
            )
            user.avatar_url = object_name
        except S3Error as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {e}")

    update_data = {
        k: v for k, v in {
            "first_name": first_name, "last_name": last_name, "username": username,
            "email": email, "citizen_id": citizen_id, "mobile_no": mobile_no,
            "address": address, "display_name": display_name, "department": department,
            "title": title, "middle_name": middle_name, "blood_type": blood_type,
            "gender": gender, "role": role
        }.items() if v is not None
    }
    
    if birth_date:
        try:
            update_data['birth_date'] = datetime.fromisoformat(birth_date.split('T')[0])
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid birth_date format. Use YYYY-MM-DD.")

    for key, value in update_data.items():
        setattr(user, key, value)
    
    user.updated_by = "admin"

    db.commit()
    db.refresh(user)
    
    if user.avatar_url:
        user.avatar_url = f"{MINIO_PUBLIC_URL}/{bucket_name}/{user.avatar_url}"

    return user


@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    # ส่วนนี้เหมือนเดิม ไม่ต้องแก้ไข
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.avatar_url:
        try:
            minio_client.remove_object(bucket_name, user.avatar_url)
        except S3Error as e:
            print(f"Error deleting object {user.avatar_url} from MinIO: {e}")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}