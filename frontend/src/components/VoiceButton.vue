<template>
  <div class="voice-button-container">
    <button 
      @click="toggleRecording" 
      :class="['voice-btn', isRecording ? 'recording' : '']"
    >
      <span class="icon">{{ isRecording ? '⏹' : '🎤' }}</span>
      <span class="text">{{ isRecording ? '停止录音' : '开始录音' }}</span>
    </button>
    <p class="hint" v-if="!isRecording && !hasRecorded">
      点击按钮，说出绘图指令
    </p>
    <p class="hint recording-hint" v-if="isRecording">
      🔴 正在录音中...
    </p>
    <p class="hint success-hint" v-if="!isRecording && hasRecorded">
      ✅ 录音完成，正在识别...
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMicrophone } from '../composables/useMicrophone.js'

const emit = defineEmits(['audio-ready'])

const { isRecording, startRecording, stopRecording, getAudioBlob } = useMicrophone()
const hasRecorded = ref(false)

async function toggleRecording() {
  if (isRecording.value) {
    stopRecording()
    hasRecorded.value = true
    
    // 等待一小段时间确保 Blob 就绪
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const blob = getAudioBlob()
    if (blob) {
      emit('audio-ready', blob)
    }
    
    // 3秒后重置状态
    setTimeout(() => {
      hasRecorded.value = false
    }, 3000)
  } else {
    hasRecorded.value = false
    await startRecording()
  }
}
</script>

<style scoped>
.voice-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
}

.voice-btn {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 4px solid #4a90d9;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 144, 217, 0.3);
}

.voice-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(74, 144, 217, 0.5);
}

.voice-btn.recording {
  border-color: #e74c3c;
  background: #fff5f5;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(231, 76, 60, 0); }
}

.icon {
  font-size: 48px;
}

.text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.hint {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.recording-hint {
  color: #e74c3c;
  font-weight: bold;
}

.success-hint {
  color: #27ae60;
}
</style>
