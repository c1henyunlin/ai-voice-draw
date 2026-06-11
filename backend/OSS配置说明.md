# 阿里云 OSS 配置说明

语音识别功能需要将音频文件上传到阿里云 OSS 以获取公网可访问的 URL。

## 配置步骤

### 1. 创建阿里云 OSS Bucket

1. 登录 [阿里云控制台](https://oss.console.aliyun.com/)
2. 点击"创建 Bucket"
3. 选择地域（如：华北2-北京）
4. 设置 Bucket 名称（如：`my-voice-app`）
5. 读写权限选择"私有"
6. 点击确定创建

### 2. 获取 AccessKey

1. 将鼠标移到右上角头像，点击"AccessKey 管理"
2. 点击"创建 AccessKey"
3. 保存 `AccessKey ID` 和 `AccessKey Secret`（只显示一次！）

### 3. 配置环境变量

编辑 `.env` 文件，填入以下信息：

```env
OSS_ACCESS_KEY_ID=LTAI5t...
OSS_ACCESS_KEY_SECRET=xxxxx
OSS_BUCKET_NAME=my-voice-app
OSS_ENDPOINT=oss-cn-beijing.aliyuncs.com
```

注意：`OSS_ENDPOINT` 根据你的 Bucket 地域选择：
- 华北2（北京）：`oss-cn-beijing.aliyuncs.com`
- 华东1（杭州）：`oss-cn-hangzhou.aliyuncs.com`
- 华东2（上海）：`oss-cn-shanghai.aliyuncs.com`
- 华南1（深圳）：`oss-cn-shenzhen.aliyuncs.com`

### 4. 安装依赖

```bash
pip install oss2
```

## 测试

重启服务后，上传音频进行语音识别测试：

```bash
python -m uvicorn main:app --reload --port 8000
```

## 常见问题

**Q: 为什么需要 OSS？**

A: DashScope 的 Paraformer 录音文件识别 API 要求音频文件必须是公网可访问的 URL，不支持直接传输本地文件或 Base64 数据。

**Q: 会产生费用吗？**

A: OSS 存储和流量会产生少量费用。对于开发测试，费用非常低（几分钱/月）。可以在阿里云控制台查看用量。

**Q: 有更简单的方案吗？**

A: 如果不想配置 OSS，可以考虑：
1. 使用其他支持直接传文件的语音识别服务（如讯飞、百度）
2. 搭建一个简单的文件服务器
3. 使用免费的临时文件托管服务（不稳定，不推荐生产环境）
