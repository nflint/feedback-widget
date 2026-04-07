import type { AnnotationTool } from '../types';
import { icons } from '../utils/icons';

export interface ToolbarCallbacks {
  onToolChange: (tool: AnnotationTool) => void;
  onColorChange: (color: string) => void;
  onUndo: () => void;
  onDone: () => void;
  onCancel: () => void;
}

export class Toolbar {
  readonly el: HTMLDivElement;
  private toolBtns: Map<AnnotationTool, HTMLButtonElement> = new Map();

  constructor(callbacks: ToolbarCallbacks) {
    this.el = document.createElement('div');
    this.el.className = 'fw-anno-toolbar';

    // Tool buttons
    const toolGroup = document.createElement('div');
    toolGroup.className = 'fw-anno-toolbar-group';

    const tools: { tool: AnnotationTool; icon: string; label: string }[] = [
      { tool: 'draw', icon: icons.draw, label: 'Draw' },
      { tool: 'highlight', icon: icons.highlight, label: 'Highlight' },
      { tool: 'redact', icon: icons.redact, label: 'Redact' },
    ];

    for (const { tool, icon, label } of tools) {
      const btn = document.createElement('button');
      btn.className = `fw-anno-tool-btn${tool === 'draw' ? ' active' : ''}`;
      btn.innerHTML = `${icon} ${label}`;
      btn.addEventListener('click', () => {
        this.setActiveTool(tool);
        callbacks.onToolChange(tool);
      });
      toolGroup.appendChild(btn);
      this.toolBtns.set(tool, btn);
    }
    this.el.appendChild(toolGroup);

    // Separator
    const sep1 = document.createElement('div');
    sep1.className = 'fw-anno-separator';
    this.el.appendChild(sep1);

    // Color picker
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ef4444';
    colorInput.className = 'fw-anno-color-input';
    colorInput.addEventListener('input', () => callbacks.onColorChange(colorInput.value));
    this.el.appendChild(colorInput);

    // Separator
    const sep2 = document.createElement('div');
    sep2.className = 'fw-anno-separator';
    this.el.appendChild(sep2);

    // Undo
    const undoBtn = document.createElement('button');
    undoBtn.className = 'fw-anno-tool-btn';
    undoBtn.innerHTML = `${icons.undo} Undo`;
    undoBtn.addEventListener('click', callbacks.onUndo);
    this.el.appendChild(undoBtn);

    // Spacer
    const spacer = document.createElement('div');
    spacer.className = 'fw-anno-spacer';
    this.el.appendChild(spacer);

    // Cancel
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'fw-anno-btn fw-anno-btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', callbacks.onCancel);
    this.el.appendChild(cancelBtn);

    // Done
    const doneBtn = document.createElement('button');
    doneBtn.className = 'fw-anno-btn fw-anno-btn-done';
    doneBtn.textContent = 'Done';
    doneBtn.addEventListener('click', callbacks.onDone);
    this.el.appendChild(doneBtn);
  }

  private setActiveTool(tool: AnnotationTool) {
    for (const [t, btn] of this.toolBtns) {
      btn.classList.toggle('active', t === tool);
    }
  }
}
