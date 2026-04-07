import { getWidgetStyles } from './styles';

export class ShadowHost {
  readonly host: HTMLDivElement;
  readonly root: ShadowRoot;

  constructor(zIndex: number, primaryColor?: string) {
    this.host = document.createElement('div');
    this.host.setAttribute('data-feedback-widget', '');
    this.host.style.position = 'fixed';
    this.host.style.zIndex = String(zIndex);
    this.host.style.top = '0';
    this.host.style.left = '0';
    this.host.style.width = '0';
    this.host.style.height = '0';
    this.host.style.overflow = 'visible';

    this.root = this.host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = getWidgetStyles(primaryColor);
    this.root.appendChild(style);

    document.body.appendChild(this.host);
  }

  hide() {
    this.host.style.display = 'none';
  }

  show() {
    this.host.style.display = '';
  }

  destroy() {
    this.host.remove();
  }
}
