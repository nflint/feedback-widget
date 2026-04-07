const MAX_HISTORY = 20;

export class History {
  private stack: ImageData[] = [];
  private index = -1;

  save(ctx: CanvasRenderingContext2D) {
    const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Discard any redo states
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(data);
    if (this.stack.length > MAX_HISTORY) {
      this.stack.shift();
    }
    this.index = this.stack.length - 1;
  }

  undo(ctx: CanvasRenderingContext2D): boolean {
    if (this.index <= 0) return false;
    this.index--;
    ctx.putImageData(this.stack[this.index], 0, 0);
    return true;
  }

  redo(ctx: CanvasRenderingContext2D): boolean {
    if (this.index >= this.stack.length - 1) return false;
    this.index++;
    ctx.putImageData(this.stack[this.index], 0, 0);
    return true;
  }

  get canUndo(): boolean {
    return this.index > 0;
  }

  get canRedo(): boolean {
    return this.index < this.stack.length - 1;
  }

  clear() {
    this.stack = [];
    this.index = -1;
  }
}
