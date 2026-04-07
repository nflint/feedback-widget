type Child = HTMLElement | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string | boolean | EventListener> | null,
  children?: Child | Child[],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else if (typeof value === 'boolean') {
        if (value) el.setAttribute(key, '');
      } else if (typeof value === 'string') {
        el.setAttribute(key, value);
      }
    }
  }

  if (children != null) {
    const list = Array.isArray(children) ? children : [children];
    for (const child of list) {
      if (child == null || child === false) continue;
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    }
  }

  return el;
}
