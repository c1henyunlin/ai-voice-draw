<template>
  <div class="canvas-wrapper">
    <canvas ref="canvasEl" width="800" height="500"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const canvasEl = ref(null)
onMounted(() => {
  const ctx = canvasEl.value.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 800, 500)
})
</script>

<style scoped>
.canvas-wrapper {
  margin-top: 20px;
}
canvas {
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>
