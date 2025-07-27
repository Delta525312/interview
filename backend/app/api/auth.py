from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import timedelta
from app.core.security import create_access_token, verify_key
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import HTTPBearer
router = APIRouter(tags=["Authentication"])

# ใช้แค่เพื่อช่วยอ่าน Bearer token จาก header เท่านั้น
oauth2_scheme = HTTPBearer()

class KeywordRequest(BaseModel):
    keyword: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/api/v1/token", response_model=Token)
def login_for_access_token(data: KeywordRequest):
    if not verify_key(data.keyword):
        raise HTTPException(status_code=400, detail="Incorrect keyword")

    expire_minutes = min(ACCESS_TOKEN_EXPIRE_MINUTES, 300)
    access_token_expires = timedelta(minutes=expire_minutes)
    access_token = create_access_token(
        data={"sub": data.keyword}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
