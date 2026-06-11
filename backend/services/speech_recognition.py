import dashscope
import os
import tempfile
from config import DASHSCOPE_API_KEY, ASR_MODEL

dashscope.api_key = DASHSCOPE_API_KEY

async def speech_to_text(audio_bytes: bytes) -> str:
    """语音转文字 - 使用 DashScope Paraformer"""
    try:
        # 使用系统临时目录（兼容 Windows/Linux/Mac）
        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
            tmp.write(audio_bytes)
            temp_path = tmp.name
        
        # 调用 DashScope 语音识别
        response = dashscope.audio.asr.Transcription.async_call(
            model=ASR_MODEL,
            file_urls=[f"file://{temp_path}"],
            sample_rate=16000,
            format='webm'
        )
        
        # 等待识别完成并获取结果
        result = response.output
        if result and result.get('results'):
            text = result['results'][0].get('text', '')
            os.unlink(temp_path)  # 清理临时文件
            return text
        
        os.unlink(temp_path)
        return ""
        
    except Exception as e:
        print(f"语音识别失败: {e}")
        raise Exception(f"语音识别服务异常: {str(e)}")
