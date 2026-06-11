from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.voice import router as voice_router

app = FastAPI(title="AI语音绘图工具后端", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router)

@app.get("/")
async def root():
    return {"message": "AI语音绘图工具后端运行中"}
