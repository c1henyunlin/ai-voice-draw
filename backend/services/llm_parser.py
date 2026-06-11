import json
from dashscope import Generation
from config import DASHSCOPE_API_KEY, LLM_MODEL

SYSTEM_PROMPT = """你是一个绘图指令解析器。用户会用自然语言描述绘图操作，你需要将其转换为JSON格式的绘图指令。

## 支持的 action 类型：
- draw_circle: 画圆，params: {x, y, radius, color}
- draw_rect: 画矩形，params: {x, y, width, height, color}
- draw_line: 画线，params: {x1, y1, x2, y2, color}
- draw_triangle: 画三角形，params: {x, y, size, color}
- draw_text: 写文字，params: {x, y, text, size, color}
- fill_background: 背景填充，params: {color}
- free_draw_on: 开启自由绘制模式，params: {}
- free_draw_off: 关闭自由绘制模式，params: {}
- set_color: 设置颜色，params: {color}
- set_line_width: 设置线条粗细，params: {width}
- undo: 撤销，params: {}
- clear: 清空画布，params: {}

颜色: red, blue, green, yellow, black, white, purple, orange, pink
画布默认800x500，未指定位置默认居中(x:400, y:250)
圆默认半径50，矩形默认100x80，三角形默认size=80，文字默认size=30
未指定颜色默认黑色
输出纯JSON，不要额外文字。"""

async def text_to_commands(user_text: str) -> list:
    try:
        response = Generation.call(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text}
            ],
            result_format='message',
            temperature=0.1
        )
        if response.status_code == 200:
            content = response.output.choices[0].message.content
            content = content.strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[1].rsplit("```", 1)[0].strip()
            result = json.loads(content)
            return result.get("commands", [])
        else:
            raise Exception(f"LLM调用失败: {response.code} - {response.message}")
    except json.JSONDecodeError as e:
        raise Exception(f"JSON解析失败: {str(e)}")
    except Exception as e:
        raise Exception(f"解析异常: {str(e)}")
