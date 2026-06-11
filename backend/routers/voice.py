from fastapi import APIRouter, UploadFile, File, HTTPException
from models.command import DrawCommand, CommandResponse
from services.speech_recognition import speech_to_text
from services.llm_parser import text_to_commands

router = APIRouter(prefix="/api/voice", tags=["voice"])

@router.post("/upload", response_model=CommandResponse)
async def upload_voice(audio: UploadFile = File(...)):
    try:
        audio_bytes = await audio.read()
        raw_text = await speech_to_text(audio_bytes)
        if not raw_text.strip():
            return CommandResponse(success=False, error="未识别到语音内容，请重试")
        commands_data = await text_to_commands(raw_text)
        commands = [
            DrawCommand(action=cmd["action"], params=cmd.get("params", {}))
            for cmd in commands_data
        ]
        return CommandResponse(success=True, commands=commands, raw_text=raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "ok"}
