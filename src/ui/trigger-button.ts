import { h } from '../utils/dom';
import { icons } from '../utils/icons';

export class TriggerButton {
  readonly el: HTMLButtonElement;

  constructor(
    text: string,
    onClick: () => void,
  ) {
    this.el = h('button', {
      class: 'fw-trigger',
      onClick,
    });
    this.el.innerHTML = icons.feedback;
    this.el.appendChild(document.createTextNode(` ${text}`));
  }

  setVisible(visible: boolean) {
    this.el.style.display = visible ? '' : 'none';
  }

  mount(root: ShadowRoot) {
    root.appendChild(this.el);
  }

  destroy() {
    this.el.remove();
  }
}
