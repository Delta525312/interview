from sqlalchemy.orm import Session
from backend.app.db.url_models import URL
import string
import random

def create_key(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def create_url(db: Session, original_url: str):
    key = create_key()
    # เช็คซ้ำ ถ้าซ้ำสุ่มใหม่
    while db.query(URL).filter(URL.key == key).first():
        key = create_key()
    url = URL(key=key, original_url=original_url)
    db.add(url)
    db.commit()
    db.refresh(url)
    return url

def get_url_by_key(db: Session, key: str):
    return db.query(URL).filter(URL.key == key).first()
