const MAX_WIDTH = 1920;

export function downscaleCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  if (canvas.width <= MAX_WIDTH) return canvas;

  const ratio = MAX_WIDTH / canvas.width;
  const newWidth = MAX_WIDTH;
  const newHeight = Math.round(canvas.height * ratio);

  const scaled = document.createElement('canvas');
  scaled.width = newWidth;
  scaled.height = newHeight;
  const ctx = scaled.getContext('2d')!;
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

  return scaled;
}

export function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}
