<template>
  <div class="app-container">
    <h1>🎨 AI语音绘图工具</h1>
    <p class="subtitle">说出指令，开始创作</p>
    <VoiceButton @audio-ready="handleAudio" />
    <CommandLog :commands="commands" />
    <DrawCanvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VoiceButton from './components/VoiceButton.vue'
import CommandLog from './components/CommandLog.vue'
import DrawCanvas from './components/DrawCanvas.vue'
import { uploadAudio } from './services/api.js'

const commands = ref([])
const canvasRef = ref(null)

async function handleAudio(audioBlob) {
  try {
    const result = await uploadAudio(audioBlob)
    if (result.commands) {
      commands.value.push(...result.commands)
      // 后续传递给 Canvas 执行绘图
    }
  } catch (err) {
    console.error('音频上传失败:', err)
    alert('语音识别失败，请重试')
  }
}
</script>

<style scoped>
.app-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}
h1 { margin-bottom: 0; color: #2c3e50; }
.subtitle { color: #999; margin-top: 5px; }
</style>
