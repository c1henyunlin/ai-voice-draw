import { ref } from 'vue'

export function useCanvas() {
  const canvasRef = ref(null)
  let ctx = null
  let history = []       // 操作历史栈（用于撤销）
  let currentColor = 'black'
  let currentLineWidth = 3

  // 初始化画布
  function initCanvas() {
    if (canvasRef.value) {
      ctx = canvasRef.value.getContext('2d')
      clearCanvas()
    }
  }

  // 清空画布
  function clearCanvas() {
    if (!ctx) return
    ctx.clearRect(0, 0, 800, 500)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 500)
    ctx.fillStyle = currentColor
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentLineWidth
  }

  // 保存当前状态到历史栈
  function saveState() {
    if (!canvasRef.value) return
    const dataUrl = canvasRef.value.toDataURL()
    history.push(dataUrl)
    if (history.length > 50) history.shift() // 最多保留50步
  }

  // 撤销上一步
  function undo() {
    if (history.length === 0) return false
    history.pop() // 移除当前状态
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

  // 设置颜色
  function setColor(color) {
    currentColor = color
    if (ctx) {
      ctx.fillStyle = color
      ctx.strokeStyle = color
    }
  }

  // 设置线条粗细
  function setLineWidth(width) {
    currentLineWidth = width
    if (ctx) {
      ctx.lineWidth = width
    }
  }

  // 画圆
  function drawCircle(x, y, radius, color) {
    if (!ctx) return
    saveState()
    const oldFill = ctx.fillStyle
    ctx.fillStyle = color || currentColor
    ctx.strokeStyle = color || currentColor
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = oldFill
  }

  // 画矩形
  function drawRect(x, y, width, height, color) {
    if (!ctx) return
    saveState()
    const oldFill = ctx.fillStyle
    ctx.fillStyle = color || currentColor
    ctx.strokeStyle = color || currentColor
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = oldFill
  }

  // 画线
  function drawLine(x1, y1, x2, y2, color) {
    if (!ctx) return
    saveState()
    ctx.strokeStyle = color || currentColor
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // 画三角形
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
  }

  // 执行单条指令
  function executeCommand(command) {
    const { action, params } = command
    
    switch (action) {
      case 'draw_circle':
        drawCircle(
          params.x || 400, 
          params.y || 250, 
          params.radius || 50, 
          params.color
        )
        break
      case 'draw_rect':
        drawRect(
          params.x || 350, 
          params.y || 210, 
          params.width || 100, 
          params.height || 80, 
          params.color
        )
        break
      case 'draw_line':
        drawLine(
          params.x1 || 100, params.y1 || 100,
          params.x2 || 400, params.y2 || 400,
          params.color
        )
        break
      case 'draw_triangle':
        drawTriangle(
          params.x || 400, 
          params.y || 250, 
          params.size || 80, 
          params.color
        )
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

  // 批量执行指令
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
