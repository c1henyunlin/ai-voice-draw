from pydantic import BaseModel
from typing import Optional, List

class DrawCommand(BaseModel):
    action: str
    params: dict = {}

class CommandResponse(BaseModel):
    success: bool
    commands: List[DrawCommand] = []
    raw_text: str = ""
    error: Optional[str] = None
