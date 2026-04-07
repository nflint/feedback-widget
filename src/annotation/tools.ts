import type { AnnotationTool } from '../types';

export interface ToolState {
  startX: number;
  startY: number;
  points: { x: number; y: number }[];
}

export interface ToolConfig {
  color: string;
  lineWidth: number;
}

export function drawToolStroke(
  ctx: CanvasRenderingContext2D,
  tool: AnnotationTool,
  state: ToolState,
  config: ToolConfig,
  currentX: number,
  currentY: number,
  preview: boolean,
) {
  switch (tool) {
    case 'draw':
      drawFreehand(ctx, state.points, config, currentX, currentY);
      break;
    case 'highlight':
      drawRect(ctx, state.startX, state.startY, currentX, currentY, config.color, 0.3, preview);
      break;
    case 'redact':
      drawRect(ctx, state.startX, state.startY, currentX, currentY, '#000000', 1.0, preview);
      break;
  }
}

function drawFreehand(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  config: ToolConfig,
  currentX: number,
  currentY: number,
) {
  if (points.length === 0) return;

  ctx.beginPath();
  ctx.strokeStyle = config.color;
  ctx.lineWidth = config.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  alpha: number,
  preview: boolean,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);
  ctx.fillRect(x, y, w, h);

  if (preview && alpha < 1) {
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }

  ctx.restore();
}
