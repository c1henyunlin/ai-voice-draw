import { ref } from 'vue'

export function useMicrophone() {
  const isRecording = ref(false)
  const audioBlob = ref(null)
  let mediaRecorder = null
  let audioChunks = []

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        audioBlob.value = new Blob(audioChunks, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      isRecording.value = true
    } catch (err) {
      console.error('麦克风访问失败:', err)
      alert('无法访问麦克风，请检查浏览器权限设置')
    }
  }

  function stopRecording() {
    if (mediaRecorder && isRecording.value) {
      mediaRecorder.stop()
      isRecording.value = false
    }
  }

  function getAudioBlob() {
    return audioBlob.value
  }

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    getAudioBlob
  }
}

// 支持 webm 格式录音
