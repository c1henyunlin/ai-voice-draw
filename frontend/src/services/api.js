const API_BASE = '/api'

export async function uploadAudio(audioBlob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const response = await fetch(`${API_BASE}/voice/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error(`上传失败: ${response.status}`)
  }

  return await response.json()
}
