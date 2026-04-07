import type { AnnotationTool } from '../types';
import { History } from './history';
import { drawToolStroke, type ToolState, type ToolConfig } from './tools';

export class CanvasManager {
  private bgCanvas: HTMLCanvasElement;
  private drawCanvas: HTMLCanvasElement;
  private bgCtx: CanvasRenderingContext2D;
  private drawCtx: CanvasRenderingContext2D;
  private history: History;
  private wrapper: HTMLDivElement;

  private isDrawing = false;
  private toolState: ToolState | null = null;
  private _tool: AnnotationTool = 'draw';
  private _config: ToolConfig = { color: '#ef4444', lineWidth: 3 };
  private snapshotBeforeStroke: ImageData | null = null;

  constructor(screenshot: HTMLCanvasElement, containerWidth: number, containerHeight: number) {
    this.history = new History();

    // Calculate dimensions to fit screenshot in container
    const scale = Math.min(
      containerWidth / screenshot.width,
      containerHeight / screenshot.height,
      1,
    );
    const displayWidth = Math.round(screenshot.width * scale);
    const displayHeight = Math.round(screenshot.height * scale);

    // Background canvas (shows the screenshot)
    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.width = screenshot.width;
    this.bgCanvas.height = screenshot.height;
    this.bgCanvas.style.width = `${displayWidth}px`;
    this.bgCanvas.style.height = `${displayHeight}px`;
    this.bgCtx = this.bgCanvas.getContext('2d')!;
    this.bgCtx.drawImage(screenshot, 0, 0);

    // Drawing canvas (transparent overlay)
    this.drawCanvas = document.createElement('canvas');
    this.drawCanvas.width = screenshot.width;
    this.drawCanvas.height = screenshot.height;
    this.drawCanvas.style.width = `${displayWidth}px`;
    this.drawCanvas.style.height = `${displayHeight}px`;
    this.drawCtx = this.drawCanvas.getContext('2d')!;

    // Save initial empty state
    this.history.save(this.drawCtx);

    // Wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'fw-anno-canvas-wrapper';
    this.wrapper.style.width = `${displayWidth}px`;
    this.wrapper.style.height = `${displayHeight}px`;
    this.wrapper.appendChild(this.bgCanvas);
    this.wrapper.appendChild(this.drawCanvas);

    this.bindEvents();
  }

  get el(): HTMLDivElement {
    return this.wrapper;
  }

  set tool(t: AnnotationTool) {
    this._tool = t;
  }

  set color(c: string) {
    this._config.color = c;
  }

  set lineWidth(w: number) {
    this._config.lineWidth = w;
  }

  undo(): boolean {
    return this.history.undo(this.drawCtx);
  }

  get canUndo(): boolean {
    return this.history.canUndo;
  }

  getCompositeDataUrl(): string {
    const output = document.createElement('canvas');
    output.width = this.bgCanvas.width;
    output.height = this.bgCanvas.height;
    const ctx = output.getContext('2d')!;
    ctx.drawImage(this.bgCanvas, 0, 0);
    ctx.drawImage(this.drawCanvas, 0, 0);
    return output.toDataURL('image/png');
  }

  destroy() {
    this.drawCanvas.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    this.history.clear();
  }

  private bindEvents() {
    this.drawCanvas.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  private toCanvasCoords(e: PointerEvent): { x: number; y: number } {
    const rect = this.drawCanvas.getBoundingClientRect();
    const scaleX = this.drawCanvas.width / rect.width;
    const scaleY = this.drawCanvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  private onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    this.isDrawing = true;
    const { x, y } = this.toCanvasCoords(e);
    this.toolState = { startX: x, startY: y, points: [{ x, y }] };
    this.snapshotBeforeStroke = this.drawCtx.getImageData(
      0, 0, this.drawCanvas.width, this.drawCanvas.height,
    );
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDrawing || !this.toolState || !this.snapshotBeforeStroke) return;
    e.preventDefault();

    const { x, y } = this.toCanvasCoords(e);
    this.toolState.points.push({ x, y });

    // Restore pre-stroke state then draw preview
    this.drawCtx.putImageData(this.snapshotBeforeStroke, 0, 0);
    drawToolStroke(this.drawCtx, this._tool, this.toolState, this._config, x, y, true);
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.isDrawing || !this.toolState || !this.snapshotBeforeStroke) return;
    this.isDrawing = false;

    const { x, y } = this.toCanvasCoords(e);

    // Restore and do final draw
    this.drawCtx.putImageData(this.snapshotBeforeStroke, 0, 0);
    drawToolStroke(this.drawCtx, this._tool, this.toolState, this._config, x, y, false);

    this.history.save(this.drawCtx);
    this.toolState = null;
    this.snapshotBeforeStroke = null;
  };
}
