<template>
  <div class="app-container">
    <h1>🎨 AI语音绘图工具</h1>
    <p class="subtitle">说出指令，开始创作</p>
    
    <VoiceButton @audio-ready="handleAudio" />
    
    <div class="toolbar" v-if="lastText">
      <span class="recognized-text">🗣 "{{ lastText }}"</span>
    </div>
    
    <DrawCanvas ref="canvasRef" />
    
    <CommandLog :commands="commandHistory" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VoiceButton from './components/VoiceButton.vue'
import DrawCanvas from './components/DrawCanvas.vue'
import CommandLog from './components/CommandLog.vue'
import { uploadAudio } from './services/api.js'

const canvasRef = ref(null)
const commandHistory = ref([])
const lastText = ref('')

async function handleAudio(audioBlob) {
  try {
    const result = await uploadAudio(audioBlob)
    
    if (result.success && result.commands.length > 0) {
      lastText.value = result.raw_text
      
      // 执行绘图指令
      if (canvasRef.value) {
        canvasRef.value.executeCommands(result.commands)
      }
      
      // 记录指令历史
      commandHistory.value.push(...result.commands)
    } else {
      alert(result.error || '未识别到指令，请重试')
    }
  } catch (err) {
    console.error('处理失败:', err)
    alert('语音识别失败，请检查后端是否启动')
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
.toolbar {
  margin: 10px 0;
  padding: 8px;
  background: #eef;
  border-radius: 6px;
  display: inline-block;
}
.recognized-text { font-size: 14px; color: #555; }
</style>
