import os
import tempfile
import requests
import json
from config import DASHSCOPE_API_KEY

async def speech_to_text(audio_bytes: bytes) -> str:
    """语音转文字 - DashScope HTTP API"""
    temp_path = None
    try:
        # 保存音频
        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
            tmp.write(audio_bytes)
            temp_path = tmp.name

        # 使用 DashScope 的 multimodal 方式，直接读文件
        url = "https://dashscope.aliyuncs.com/compatible-mode/v1/audio/transcriptions"
        
        with open(temp_path, 'rb') as f:
            response = requests.post(
                url,
                headers={"Authorization": f"Bearer {DASHSCOPE_API_KEY}"},
                files={"file": ("audio.webm", f, "audio/webm")},
                data={"model": "paraformer-realtime-v2"},
                timeout=30
            )
        
        print(f"ASR 响应: {response.status_code} - {response.text[:300]}")
        
        if response.status_code == 200:
            result = response.json()
            text = result.get("text", "")
            if text:
                print(f"识别成功: {text}")
                return text
        
        return ""

    except Exception as e:
        print(f"语音识别异常: {e}")
        return ""
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
