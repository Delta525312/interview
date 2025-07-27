import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# โหลดค่าจากไฟล์ .env ที่อยู่ในโฟลเดอร์เดียวกัน
load_dotenv()


SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:password@localhost:5432/mydb"
)

print("="*60)
print(f"กำลังเชื่อมต่อฐานข้อมูลด้วย URL: {SQLALCHEMY_DATABASE_URL}")
print("="*60)


# สร้าง Engine ด้วย URL ที่ได้มา
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# สร้าง SessionLocal และ Base สำหรับใช้งานในส่วนอื่นๆ
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ฟังก์ชันสำหรับ Dependency Injection ใน FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()