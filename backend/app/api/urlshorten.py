from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from fastapi.responses import RedirectResponse
from app.api.auth import oauth2_scheme
from app.core.security import decode_access_token
from app.db.database import SessionLocal
from app.db.models import URLShorten, URLShortenAudit
from app.schemas.urlshorten import URLShortenCreate, URLShortenUpdate, URLShortenResponse,URLShortenAuditResponse
import string
from fastapi import Response
import random
from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter(prefix="/api/v1/urlshorten", tags=["URL Shorten"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    token_str = token.credentials
    user = decode_access_token(token_str)
    return user

def generate_short_key(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def log_audit(db: Session, action: str, user: str):
    audit = URLShortenAudit(
        action=action,
        performed_by=user,
        performed_at=datetime.utcnow()
    )
    db.add(audit)
    db.commit()


@router.post("/", response_model=URLShortenResponse)
async def create_url(
    data: URLShortenCreate,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    key = generate_short_key()
    while db.query(URLShorten).filter(URLShorten.short_key == key).first():
        key = generate_short_key()

    new_url = URLShorten(
        original_url=str(data.original_url),
        short_key=key,
        created_at=datetime.utcnow(),
        clicks=0,
        created_by=user
    )
    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    log_audit(db, "CREATE", user)

    return new_url

@router.get("/audit", response_model=List[URLShortenAuditResponse])
async def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(URLShortenAudit).order_by(URLShortenAudit.performed_at.desc()).all()
    return logs

@router.get("/", response_model=List[URLShortenResponse])
async def get_all_urls(db: Session = Depends(get_db)):
    return db.query(URLShorten).all()


@router.get("/id/{url_id}", response_model=URLShortenResponse)
async def get_url_by_id(url_id: int, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    url = db.query(URLShorten).filter(URLShorten.id == url_id).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    return url

@router.get("/{short_key}", response_model=URLShortenResponse)
async def get_url_by_short_key(short_key: str, db: Session = Depends(get_db)):
    url = db.query(URLShorten).filter(URLShorten.short_key == short_key).first()
    if not url:
        raise HTTPException(status_code=404, detail="Short URL not found")
    url.clicks += 1
    db.commit()
    db.refresh(url)
    return url


@router.put("/id/{url_id}", response_model=URLShortenResponse)
async def update_url(
    url_id: int,
    data: URLShortenUpdate,  # ต้องเพิ่ม short_key ใน schema URLShortenUpdate ด้วย
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    url = db.query(URLShorten).filter(URLShorten.id == url_id).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    # ตรวจสอบว่ามี short_key ใหม่ และตรวจสอบว่าซ้ำหรือไม่
    if data.short_key and data.short_key != url.short_key:
        existing = db.query(URLShorten).filter(URLShorten.short_key == data.short_key).first()
        if existing:
            raise HTTPException(status_code=400, detail="short_key already exists")
        url.short_key = data.short_key

    url.original_url = data.original_url
    url.updated_at = datetime.utcnow()
    url.updated_by = user
    db.commit()
    db.refresh(url)

    log_audit(db, "UPDATE", user)  

    return url


@router.patch("/id/{url_id}/click", response_model=URLShortenResponse)
async def increment_click(
    url_id: int,
    db: Session = Depends(get_db),
):
    url = db.query(URLShorten).filter(URLShorten.id == url_id).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    url.clicks = (url.clicks or 0) + 1  # เผื่อคลิกเริ่มต้นเป็น None
    url.updated_at = datetime.utcnow()
    # url.updated_by = user  # ลบออก เพราะไม่มี user
    db.commit()
    db.refresh(url)

    return url


@router.delete("/id/{url_id}", status_code=204)
async def delete_url(
    url_id: int,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    url = db.query(URLShorten).filter(URLShorten.id == url_id).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    short_key = url.short_key
    db.delete(url)
    db.commit()

    log_audit(db, "DELETE", user)

    return Response(status_code=204)