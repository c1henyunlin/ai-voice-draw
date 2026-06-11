# AI语音绘图工具 (AI Voice Draw)

## 项目介绍
一款纯语音控制的浏览器绘图工具，用户无需鼠标键盘，仅通过语音指令即可完成绘图创作。适用于无障碍交互场景、创意表达等。

## 功能列表
- [x] 语音录制与实时传输
- [x] 语音转文字（ASR）
- [x] 自然语言指令解析为绘图操作
- [x] 绘制基本图形（圆、矩形、线条、三角形、文字）
- [x] 设置颜色、线条粗细
- [x] 背景填充
- [x] 撤销上一步
- [x] 清空画布
- [x] 指令历史日志

## 技术栈
- **前端**：Vue.js 3 + Vite + Canvas API + MediaRecorder API
- **后端**：Python FastAPI
- **AI服务**：阿里云百炼 DashScope（Paraformer语音识别 + Qwen大模型指令解析）
- **存储**：阿里云OSS（音频文件临时存储）

## 本地运行步骤

### 1. 克隆仓库
```bash
git clone git@github.com:c1henyunlin/ai-voice-draw.git
cd ai-voice-draw
```

### 2. 配置环境变量
编辑 `backend/.env` 文件，填入您的 API Key 和 OSS 配置：
```env
DASHSCOPE_API_KEY=your_dashscope_api_key
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET_NAME=your_bucket_name
OSS_ENDPOINT=oss-cn-beijing.aliyuncs.com
```

### 3. 启动后端
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 4. 启动前端
```bash
cd frontend
npm install
npm run dev
```

### 5. 打开浏览器
访问 http://localhost:5173

## 支持的语音指令示例
- "画一个红色的圆"
- "在中间画一个蓝色的矩形"
- "画一条从左上到右下的线"
- "写一个你好世界"
- "背景变成黄色"
- "撤销"
- "清空画布"

## OSS配置说明
语音识别需要将音频上传到阿里云OSS获取公网URL。详细配置步骤请参考 `backend/OSS配置说明.md`

## Demo视频
[链接待补充]

## 设计文档
详见 docs/design.md