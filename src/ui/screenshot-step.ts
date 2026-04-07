import { h } from '../utils/dom';

export class ScreenshotStep {
  readonly el: HTMLDivElement;

  constructor(
    dataUrl: string,
    onAnnotate: () => void,
    onSkip: () => void,
    onRetake: () => void,
  ) {
    const img = h('img', { src: dataUrl, alt: 'Screenshot preview' });
    const preview = h('div', { class: 'fw-screenshot-preview' }, [img]);

    const annotateBtn = h('button', {
      class: 'fw-btn fw-btn-primary',
      onClick: onAnnotate,
      type: 'button',
    }, 'Annotate');

    const retakeBtn = h('button', {
      class: 'fw-btn fw-btn-secondary',
      onClick: onRetake,
      type: 'button',
    }, 'Retake');

    const skipBtn = h('button', {
      class: 'fw-btn fw-btn-ghost',
      onClick: onSkip,
      type: 'button',
    }, 'Remove Screenshot');

    const actions = h('div', { class: 'fw-actions' }, [
      skipBtn,
      retakeBtn,
      annotateBtn,
    ]);

    this.el = h('div', null, [
      h('p', { style: 'color:var(--fw-text-secondary);margin-bottom:12px;font-size:14px' },
        'Review your screenshot. You can annotate it to highlight issues.'),
      preview,
      actions,
    ]);
  }
}
