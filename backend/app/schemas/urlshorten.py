from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class URLShortenBase(BaseModel):
    original_url: HttpUrl

class URLShortenCreate(URLShortenBase):
     original_url: HttpUrl

class URLShortenUpdate(BaseModel):
    original_url: HttpUrl
    short_key: Optional[str] = None
    
class URLShortenResponse(URLShortenBase):
    id: int
    short_key: str
    created_at: datetime
    updated_at: Optional[datetime]
    clicks: int
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        orm_mode = True
        
#   getlog      
class URLShortenAuditResponse(BaseModel):
    id: int
    action: str
    performed_by: str
    performed_at: datetime
    short_key: Optional[str] = None  # short_key may not be present in all logs
    class Config:
        orm_mode = True