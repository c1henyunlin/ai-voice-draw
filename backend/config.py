import os
from dotenv import load_dotenv

load_dotenv()

DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY", "your-api-key-here")
ASR_MODEL = "paraformer-realtime-v2"
LLM_MODEL = "qwen-plus"
