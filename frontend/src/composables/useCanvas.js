import { ref } from 'vue'

export function useCanvas() {
  const canvasRef = ref(null)
  let ctx = null
  let history = []
  let currentColor = 'black'
  let currentLineWidth = 3
  let isFreeDrawing = false
  let freeDrawStart = null

  function initCanvas() {
    if (canvasRef.value) {
      ctx = canvasRef.value.getContext('2d')
      clearCanvas()
      
      // 自由绘制事件监听
      canvasRef.value.addEventListener('mousedown', startFreeDraw)
      canvasRef.value.addEventListener('mousemove', freeDraw)
      canvasRef.value.addEventListener('mouseup', endFreeDraw)
    }
  }

  function clearCanvas() {
    if (!ctx) return
    ctx.clearRect(0, 0, 800, 500)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 500)
    ctx.fillStyle = currentColor
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentLineWidth
  }

  function saveState() {
    if (!canvasRef.value) return
    const dataUrl = canvasRef.value.toDataURL()
    history.push(dataUrl)
    if (history.length > 50) history.shift()
  }

  function undo() {
    if (history.length === 0) return false
    history.pop()
    const prevState = history.length > 0 ? history[history.length - 1] : null
    if (prevState) {
      const img = new Image()
      img.src = prevState
      img.onload = () => {
        ctx.clearRect(0, 0, 800, 500)
        ctx.drawImage(img, 0, 0)
      }
    } else {
      clearCanvas()
    }
    return true
  }

  // === 样式设置 ===
  
  function setColor(color) {
    currentColor = color
    if (ctx) {
      ctx.fillStyle = color
      ctx.strokeStyle = color
    }
  }

  function setLineWidth(width) {
    currentLineWidth = width
    if (ctx) ctx.lineWidth = width
  }

  // === 背景填充 ===
  
  function fillBackground(color) {
    if (!ctx) return
    saveState()
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 800, 500)
    ctx.fillStyle = currentColor
    ctx.strokeStyle = currentColor
  }

  // === 基础图形 ===

  function drawCircle(x, y, radius, color) {
    if (!ctx) return
    saveState()
    ctx.fillStyle = color || currentColor
    ctx.strokeStyle = color || currentColor
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = currentColor
  }

  function drawRect(x, y, width, height, color) {
    if (!ctx) return
    saveState()
    ctx.fillStyle = color || currentColor
    ctx.strokeStyle = color || currentColor
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = currentColor
  }

  function drawLine(x1, y1, x2, y2, color) {
    if (!ctx) return
    saveState()
    ctx.strokeStyle = color || currentColor
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.strokeStyle = currentColor
  }

  function drawTriangle(x, y, size, color) {
    if (!ctx) return
    saveState()
    ctx.fillStyle = color || currentColor
    ctx.strokeStyle = color || currentColor
    ctx.beginPath()
    ctx.moveTo(x, y - size / 2)
    ctx.lineTo(x - size / 2, y + size / 2)
    ctx.lineTo(x + size / 2, y + size / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = currentColor
  }

  // === 文字绘制 ===
  
  function drawText(x, y, text, size, color) {
    if (!ctx) return
    saveState()
    ctx.fillStyle = color || currentColor
    ctx.font = `${size || 30}px Arial`
    ctx.fillText(text, x, y)
    ctx.fillStyle = currentColor
  }

  // === 自由绘制 ===
  
  function enableFreeDraw() {
    isFreeDrawing = true
    canvasRef.value.style.cursor = 'crosshair'
  }

  function disableFreeDraw() {
    isFreeDrawing = false
    canvasRef.value.style.cursor = 'default'
  }

  function startFreeDraw(e) {
    if (!isFreeDrawing) return
    saveState()
    freeDrawStart = { x: e.offsetX, y: e.offsetY }
    ctx.beginPath()
    ctx.moveTo(freeDrawStart.x, freeDrawStart.y)
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentLineWidth
  }

  function freeDraw(e) {
    if (!isFreeDrawing || !freeDrawStart) return
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
  }

  function endFreeDraw() {
    if (!isFreeDrawing) return
    freeDrawStart = null
  }

  // === 指令执行引擎 ===

  function executeCommand(command) {
    const { action, params } = command
    switch (action) {
      case 'draw_circle':
        drawCircle(params.x || 400, params.y || 250, params.radius || 50, params.color)
        break
      case 'draw_rect':
        drawRect(params.x || 350, params.y || 210, params.width || 100, params.height || 80, params.color)
        break
      case 'draw_line':
        drawLine(params.x1 || 100, params.y1 || 100, params.x2 || 400, params.y2 || 400, params.color)
        break
      case 'draw_triangle':
        drawTriangle(params.x || 400, params.y || 250, params.size || 80, params.color)
        break
      case 'draw_text':
        drawText(params.x || 400, params.y || 250, params.text || 'Hello', params.size || 30, params.color)
        break
      case 'fill_background':
        fillBackground(params.color || '#ffffff')
        break
      case 'free_draw_on':
        enableFreeDraw()
        break
      case 'free_draw_off':
        disableFreeDraw()
        break
      case 'set_color':
        setColor(params.color || 'black')
        break
      case 'set_line_width':
        setLineWidth(params.width || 3)
        break
      case 'undo':
        undo()
        break
      case 'clear':
        saveState()
        clearCanvas()
        break
      default:
        console.warn('未知指令:', action)
    }
  }

  function executeCommands(commands) {
    commands.forEach(cmd => executeCommand(cmd))
  }

  return {
    canvasRef,
    initCanvas,
    executeCommand,
    executeCommands,
    clearCanvas,
    undo,
    setColor,
    setLineWidth
  }
}
