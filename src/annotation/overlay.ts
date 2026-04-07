import { getAnnotationOverlayStyles } from '../styles';
import { CanvasManager } from './canvas-manager';
import { Toolbar } from './toolbar';

export class AnnotationOverlay {
  private container: HTMLDivElement;
  private styleEl: HTMLStyleElement;
  private canvasManager: CanvasManager;
  private toolbar: Toolbar;
  private escHandler: (e: KeyboardEvent) => void;

  constructor(
    screenshot: HTMLCanvasElement,
    onDone: (annotatedDataUrl: string) => void,
    onCancel: () => void,
  ) {
    // Inject styles into document head (outside shadow DOM)
    this.styleEl = document.createElement('style');
    this.styleEl.textContent = getAnnotationOverlayStyles();
    document.head.appendChild(this.styleEl);

    // Create full-screen overlay
    this.container = document.createElement('div');
    this.container.setAttribute('data-feedback-widget-overlay', '');

    // Canvas manager
    const padding = 80; // toolbar height + some margin
    this.canvasManager = new CanvasManager(
      screenshot,
      window.innerWidth - 40,
      window.innerHeight - padding - 40,
    );

    // Toolbar
    this.toolbar = new Toolbar({
      onToolChange: (tool) => { this.canvasManager.tool = tool; },
      onColorChange: (color) => { this.canvasManager.color = color; },
      onUndo: () => { this.canvasManager.undo(); },
      onDone: () => {
        const dataUrl = this.canvasManager.getCompositeDataUrl();
        this.destroy();
        onDone(dataUrl);
      },
      onCancel: () => {
        this.destroy();
        onCancel();
      },
    });

    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'fw-anno-canvas-container';
    canvasContainer.appendChild(this.canvasManager.el);

    this.container.appendChild(this.toolbar.el);
    this.container.appendChild(canvasContainer);

    // Escape to cancel
    this.escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.destroy();
        onCancel();
      }
    };
    document.addEventListener('keydown', this.escHandler);

    document.body.appendChild(this.container);
  }

  destroy() {
    document.removeEventListener('keydown', this.escHandler);
    this.canvasManager.destroy();
    this.container.remove();
    this.styleEl.remove();
  }
}
