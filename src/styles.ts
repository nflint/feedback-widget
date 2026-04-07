export function getWidgetStyles(primaryColor: string = '#6366f1'): string {
  return `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
      --fw-primary: ${primaryColor};
      --fw-primary-hover: color-mix(in srgb, ${primaryColor} 85%, black);
      --fw-bg: #ffffff;
      --fw-bg-secondary: #f9fafb;
      --fw-border: #e5e7eb;
      --fw-text: #1f2937;
      --fw-text-secondary: #6b7280;
      --fw-radius: 8px;
      --fw-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Trigger Button — vertical left-side tab (Marker.io style) */
    .fw-trigger {
      position: fixed;
      left: 0;
      top: 50%;
      z-index: 2147483646;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px 8px;
      background: #E5534B;
      color: white;
      border: none;
      border-radius: 0 6px 6px 0;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      letter-spacing: 0.5px;
      writing-mode: vertical-rl;
      transform: translateY(-50%) rotate(180deg);
      box-shadow: 2px 0 8px rgba(0,0,0,0.15);
      transition: padding 0.15s ease, box-shadow 0.15s ease;
    }
    .fw-trigger:hover {
      padding: 12px 10px;
      box-shadow: 3px 0 12px rgba(0,0,0,0.25);
    }
    .fw-trigger:active { padding: 12px 8px; }
    .fw-trigger svg { flex-shrink: 0; }

    /* Backdrop */
    .fw-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 2147483646;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .fw-backdrop.visible { opacity: 1; }

    /* Modal — opens from the left side */
    .fw-modal {
      position: fixed;
      left: 50px;
      top: 50%;
      z-index: 2147483647;
      width: 420px;
      max-height: calc(100vh - 80px);
      background: var(--fw-bg);
      border-radius: 12px;
      box-shadow: var(--fw-shadow);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transform: translateY(-50%) translateX(-10px) scale(0.97);
      opacity: 0;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    .fw-modal.visible {
      transform: translateY(-50%) translateX(0) scale(1);
      opacity: 1;
    }

    .fw-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--fw-border);
    }
    .fw-modal-header h2 {
      font-size: 16px;
      font-weight: 600;
      color: var(--fw-text);
    }
    .fw-modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    /* Close button */
    .fw-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      color: var(--fw-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    .fw-close:hover { background: var(--fw-bg-secondary); }

    /* Back button */
    .fw-back {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      color: var(--fw-text-secondary);
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-family: inherit;
      transition: color 0.15s;
    }
    .fw-back:hover { color: var(--fw-text); }

    /* Category Cards */
    .fw-categories {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .fw-category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 12px;
      background: var(--fw-bg);
      border: 2px solid var(--fw-border);
      border-radius: var(--fw-radius);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: var(--fw-text);
      transition: border-color 0.15s, background 0.15s;
    }
    .fw-category-card:hover {
      border-color: var(--fw-primary);
      background: var(--fw-bg-secondary);
    }
    .fw-category-card svg { color: var(--fw-text-secondary); }
    .fw-category-card:hover svg { color: var(--fw-primary); }

    /* Form */
    .fw-form { display: flex; flex-direction: column; gap: 14px; }

    .fw-field label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--fw-text);
      margin-bottom: 4px;
    }
    .fw-field input,
    .fw-field textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--fw-border);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      color: var(--fw-text);
      background: var(--fw-bg);
      outline: none;
      transition: border-color 0.15s;
    }
    .fw-field input:focus,
    .fw-field textarea:focus {
      border-color: var(--fw-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, ${primaryColor} 15%, transparent);
    }
    .fw-field textarea {
      resize: vertical;
      min-height: 80px;
    }
    .fw-field .fw-optional {
      font-weight: 400;
      color: var(--fw-text-secondary);
      font-size: 12px;
    }
    .fw-field .fw-error {
      color: #ef4444;
      font-size: 12px;
      margin-top: 2px;
    }

    /* Priority Toggle */
    .fw-priority-group {
      display: flex;
      gap: 0;
      border: 1px solid var(--fw-border);
      border-radius: 6px;
      overflow: hidden;
    }
    .fw-priority-btn {
      flex: 1;
      padding: 6px 12px;
      border: none;
      background: var(--fw-bg);
      color: var(--fw-text-secondary);
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s;
      border-right: 1px solid var(--fw-border);
    }
    .fw-priority-btn:last-child { border-right: none; }
    .fw-priority-btn:hover { background: var(--fw-bg-secondary); }
    .fw-priority-btn.active {
      background: var(--fw-primary);
      color: white;
    }

    /* Buttons */
    .fw-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
    }
    .fw-btn-primary {
      background: var(--fw-primary);
      color: white;
    }
    .fw-btn-primary:hover { background: var(--fw-primary-hover); }
    .fw-btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .fw-btn-secondary {
      background: var(--fw-bg-secondary);
      color: var(--fw-text);
      border: 1px solid var(--fw-border);
    }
    .fw-btn-secondary:hover { background: var(--fw-border); }
    .fw-btn-ghost {
      background: none;
      color: var(--fw-text-secondary);
    }
    .fw-btn-ghost:hover { color: var(--fw-text); background: var(--fw-bg-secondary); }

    .fw-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    .fw-actions-spread {
      justify-content: space-between;
    }

    /* Screenshot Preview */
    .fw-screenshot-preview {
      border: 1px solid var(--fw-border);
      border-radius: var(--fw-radius);
      overflow: hidden;
      margin-bottom: 12px;
    }
    .fw-screenshot-preview img {
      display: block;
      width: 100%;
      height: auto;
    }
    .fw-screenshot-actions {
      display: flex;
      gap: 8px;
      padding: 8px;
      background: var(--fw-bg-secondary);
      border-top: 1px solid var(--fw-border);
    }

    /* Success state */
    .fw-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 32px 20px;
      text-align: center;
    }
    .fw-success-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #10b981;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fw-success h3 { font-size: 16px; font-weight: 600; }
    .fw-success p { color: var(--fw-text-secondary); font-size: 14px; }

    /* Loading spinner */
    .fw-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: fw-spin 0.6s linear infinite;
    }
    @keyframes fw-spin { to { transform: rotate(360deg); } }
  `;
}

export function getAnnotationOverlayStyles(): string {
  return `
    [data-feedback-widget-overlay] {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: #1a1a2e;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    [data-feedback-widget-overlay] * { box-sizing: border-box; margin: 0; padding: 0; }

    .fw-anno-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #2d2d44;
      border-bottom: 1px solid #3d3d5c;
      color: white;
      flex-shrink: 0;
    }
    .fw-anno-toolbar-group {
      display: flex;
      gap: 2px;
      background: #1a1a2e;
      border-radius: 6px;
      padding: 2px;
    }
    .fw-anno-tool-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: #a0a0c0;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s;
    }
    .fw-anno-tool-btn:hover { color: white; background: #3d3d5c; }
    .fw-anno-tool-btn.active { color: white; background: #6366f1; }

    .fw-anno-separator {
      width: 1px;
      height: 24px;
      background: #3d3d5c;
      margin: 0 4px;
    }

    .fw-anno-color-input {
      width: 28px;
      height: 28px;
      border: 2px solid #3d3d5c;
      border-radius: 6px;
      cursor: pointer;
      background: none;
      padding: 0;
    }
    .fw-anno-color-input::-webkit-color-swatch-wrapper { padding: 2px; }
    .fw-anno-color-input::-webkit-color-swatch { border: none; border-radius: 3px; }

    .fw-anno-spacer { flex: 1; }

    .fw-anno-btn {
      padding: 6px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s;
    }
    .fw-anno-btn-done {
      background: #6366f1;
      color: white;
    }
    .fw-anno-btn-done:hover { background: #5558e6; }
    .fw-anno-btn-cancel {
      background: transparent;
      color: #a0a0c0;
    }
    .fw-anno-btn-cancel:hover { color: white; }

    .fw-anno-canvas-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    .fw-anno-canvas-wrapper {
      position: relative;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .fw-anno-canvas-wrapper canvas {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }
    .fw-anno-canvas-wrapper canvas:last-child {
      cursor: crosshair;
    }
  `;
}
