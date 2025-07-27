from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class URLShorten(Base):
    __tablename__ = "url_shorten"
    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String, nullable=False)
    short_key = Column(String(10), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=False), server_default=func.now())  # เปลี่ยน timezone=True -> False
    updated_at = Column(DateTime(timezone=False), onupdate=func.now())       # เปลี่ยน timezone=True -> False
    clicks = Column(Integer, default=0)
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

class URLShortenAudit(Base):
    __tablename__ = "url_shorten_audit"
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)  # เช่น "CREATE", "UPDATE", "DELETE"
    performed_by = Column(String, nullable=False)
    performed_at = Column(DateTime(timezone=False), server_default=func.now())  # เปลี่ยน timezone=True -> False
