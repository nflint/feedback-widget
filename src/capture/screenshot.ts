import html2canvas from 'html2canvas-pro';

export async function captureScreenshot(
  hideElement?: HTMLElement,
): Promise<HTMLCanvasElement> {
  if (hideElement) {
    hideElement.style.display = 'none';
  }

  try {
    const canvas = await html2canvas(document.documentElement, {
      useCORS: true,
      logging: false,
      scale: Math.min(window.devicePixelRatio, 2),
      width: window.innerWidth,
      height: window.innerHeight,
      x: window.scrollX,
      y: window.scrollY,
      ignoreElements: (el) => el.hasAttribute('data-feedback-widget'),
    });
    return canvas;
  } finally {
    if (hideElement) {
      hideElement.style.display = '';
    }
  }
}
