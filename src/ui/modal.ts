import { h } from '../utils/dom';
import { icons } from '../utils/icons';

export class Modal {
  readonly backdrop: HTMLDivElement;
  readonly el: HTMLDivElement;
  readonly header: HTMLDivElement;
  readonly headerTitle: HTMLHeadingElement;
  readonly headerLeft: HTMLDivElement;
  readonly body: HTMLDivElement;
  private onClose: () => void;
  private escHandler: (e: KeyboardEvent) => void;

  constructor(onClose: () => void) {
    this.onClose = onClose;

    this.backdrop = h('div', { class: 'fw-backdrop' });
    this.backdrop.addEventListener('click', onClose);

    this.headerTitle = h('h2', null, 'Send Feedback');
    this.headerLeft = h('div', { style: 'display:flex;align-items:center;gap:8px' }, [this.headerTitle]);

    const closeBtn = h('button', { class: 'fw-close', onClick: onClose });
    closeBtn.innerHTML = icons.close;

    this.header = h('div', { class: 'fw-modal-header' }, [this.headerLeft, closeBtn]);
    this.body = h('div', { class: 'fw-modal-body' });

    this.el = h('div', { class: 'fw-modal' }, [this.header, this.body]);

    this.escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
  }

  setTitle(title: string) {
    this.headerTitle.textContent = title;
  }

  setBackButton(onClick: (() => void) | null) {
    const existing = this.headerLeft.querySelector('.fw-back');
    if (existing) existing.remove();

    if (onClick) {
      const btn = h('button', { class: 'fw-back', onClick });
      btn.innerHTML = icons.arrowLeft;
      this.headerLeft.insertBefore(btn, this.headerTitle);
    }
  }

  setContent(content: HTMLElement) {
    this.body.innerHTML = '';
    this.body.appendChild(content);
  }

  open(root: ShadowRoot) {
    root.appendChild(this.backdrop);
    root.appendChild(this.el);
    document.addEventListener('keydown', this.escHandler);

    requestAnimationFrame(() => {
      this.backdrop.classList.add('visible');
      this.el.classList.add('visible');
    });
  }

  close() {
    document.removeEventListener('keydown', this.escHandler);
    this.backdrop.classList.remove('visible');
    this.el.classList.remove('visible');

    setTimeout(() => {
      this.backdrop.remove();
      this.el.remove();
    }, 200);
  }

  destroy() {
    document.removeEventListener('keydown', this.escHandler);
    this.backdrop.remove();
    this.el.remove();
  }
}
