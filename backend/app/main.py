# main.py หรือ app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from app.db.database import Base, engine
from app.api.urlshorten import router as urlshorten_router
from app.api.auth import router as auth_router  
from app.api.simulation import router as simulation_router  
from app.api.user import router as user_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.add_middleware(SlowAPIMiddleware)
app.state.limiter = limiter

# รวม router ต่าง ๆ
app.include_router(auth_router)
app.include_router(urlshorten_router)

# เพิ่ม prefix /simulation สำหรับ simulation router
app.include_router(simulation_router)
app.include_router(user_router)
