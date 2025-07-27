from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import crud
from app.schemas import schema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/shorten", response_model=schema.URLResponse)
def shorten_url(url: schema.URLRequest, db: Session = Depends(get_db)):
    new_url = crud.create_url(db, url.original_url)
    return {"key": new_url.key}

@router.get("/{key}")
def redirect_url(key: str, db: Session = Depends(get_db)):
    url = crud.get_url_by_key(db, key)
    if url:
        return RedirectResponse(url.original_url)
    raise HTTPException(status_code=404, detail="URL not found")
