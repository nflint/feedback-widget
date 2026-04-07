import type { FeedbackWidgetConfig, FeedbackCategory, FeedbackPayload, WidgetState } from './types';
import { ShadowHost } from './shadow-host';
import { TriggerButton } from './ui/trigger-button';
import { Modal } from './ui/modal';
import { CategoryStep } from './ui/category-step';
import { DetailsStep, type DetailsData } from './ui/details-step';
import { ScreenshotStep } from './ui/screenshot-step';
import { AnnotationOverlay } from './annotation/overlay';
import { captureScreenshot } from './capture/screenshot';
import { downscaleCanvas, canvasToDataUrl } from './capture/image-utils';
import { createGitHubIssue } from './integrations/github';
import { h } from './utils/dom';
import { icons } from './utils/icons';

export class Widget {
  private config: FeedbackWidgetConfig;
  private shadowHost: ShadowHost;
  private trigger: TriggerButton;
  private modal: Modal | null = null;
  private annotationOverlay: AnnotationOverlay | null = null;

  private state: WidgetState = {
    step: 'idle',
    category: null,
    title: '',
    description: '',
    priority: 'medium',
    email: '',
    screenshotCanvas: null,
    screenshotDataUrl: null,
    annotatedDataUrl: null,
  };

  constructor(config: FeedbackWidgetConfig) {
    this.config = config;

    const zIndex = config.zIndex ?? 999999;
    this.shadowHost = new ShadowHost(zIndex, config.theme?.primaryColor);
    this.trigger = new TriggerButton(
      config.triggerText ?? 'Feedback',
      () => this.open(),
    );
    this.trigger.mount(this.shadowHost.root);
  }

  private open() {
    this.trigger.setVisible(false);
    this.resetState();
    this.state.step = 'category';

    this.modal = new Modal(() => this.close());
    this.modal.open(this.shadowHost.root);
    this.showCategoryStep();
  }

  private close() {
    if (this.modal) {
      this.modal.close();
      this.modal = null;
    }
    this.trigger.setVisible(true);
    this.resetState();
  }

  private resetState() {
    this.state = {
      step: 'idle',
      category: null,
      title: '',
      description: '',
      priority: 'medium',
      email: '',
      screenshotCanvas: null,
      screenshotDataUrl: null,
      annotatedDataUrl: null,
    };
  }

  private showCategoryStep() {
    if (!this.modal) return;
    this.state.step = 'category';
    this.modal.setTitle('Send Feedback');
    this.modal.setBackButton(null);

    const step = new CategoryStep((category: FeedbackCategory) => {
      this.state.category = category;
      this.showDetailsStep();
    });
    this.modal.setContent(step.el);
  }

  private showDetailsStep() {
    if (!this.modal) return;
    this.state.step = 'details';

    const labels: Record<FeedbackCategory, string> = {
      bug: 'Report a Bug',
      enhancement: 'Suggest Enhancement',
      question: 'Ask a Question',
      other: 'Other Feedback',
    };
    this.modal.setTitle(labels[this.state.category!]);
    this.modal.setBackButton(() => this.showCategoryStep());

    const step = new DetailsStep(
      (data: DetailsData) => this.handleSubmit(data),
      () => this.handleCapture(),
      !!this.state.screenshotDataUrl,
    );
    this.modal.setContent(step.el);
  }

  private async handleCapture() {
    if (!this.modal) return;

    // Hide modal during capture
    this.modal.el.style.display = 'none';
    this.modal.backdrop.style.display = 'none';

    try {
      const canvas = await captureScreenshot(this.shadowHost.host);
      const scaled = downscaleCanvas(canvas);
      this.state.screenshotCanvas = scaled;
      this.state.screenshotDataUrl = canvasToDataUrl(scaled);
      this.state.annotatedDataUrl = null;
      this.showScreenshotStep();
    } catch {
      // Restore modal on failure
      if (this.modal) {
        this.modal.el.style.display = '';
        this.modal.backdrop.style.display = '';
      }
    }
  }

  private showScreenshotStep() {
    if (!this.modal) return;
    this.state.step = 'screenshot';

    this.modal.el.style.display = '';
    this.modal.backdrop.style.display = '';
    this.modal.setTitle('Screenshot');
    this.modal.setBackButton(() => this.showDetailsStep());

    const dataUrl = this.state.annotatedDataUrl || this.state.screenshotDataUrl!;

    const step = new ScreenshotStep(
      dataUrl,
      () => this.openAnnotation(),
      () => {
        this.state.screenshotCanvas = null;
        this.state.screenshotDataUrl = null;
        this.state.annotatedDataUrl = null;
        this.showDetailsStep();
      },
      () => this.handleCapture(),
    );
    this.modal.setContent(step.el);
  }

  private openAnnotation() {
    if (!this.modal || !this.state.screenshotCanvas) return;

    // Hide modal
    this.modal.el.style.display = 'none';
    this.modal.backdrop.style.display = 'none';

    this.annotationOverlay = new AnnotationOverlay(
      this.state.screenshotCanvas,
      (annotatedDataUrl: string) => {
        this.state.annotatedDataUrl = annotatedDataUrl;
        this.annotationOverlay = null;
        this.showScreenshotStep();
      },
      () => {
        this.annotationOverlay = null;
        this.showScreenshotStep();
      },
    );
  }

  private async handleSubmit(data: DetailsData) {
    if (!this.modal) return;
    this.state.step = 'submitting';

    // Show loading state
    const loadingEl = h('div', { style: 'display:flex;align-items:center;justify-content:center;padding:40px' }, [
      h('div', { class: 'fw-spinner' }),
    ]);
    this.modal.setContent(loadingEl);
    this.modal.setBackButton(null);
    this.modal.setTitle('Submitting...');

    const payload: FeedbackPayload = {
      category: this.state.category!,
      title: data.title,
      description: data.description,
      priority: data.priority,
      email: data.email || null,
      screenshot: this.state.screenshotDataUrl,
      annotatedScreenshot: this.state.annotatedDataUrl,
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        timestamp: new Date().toISOString(),
      },
    };

    try {
      const results = await Promise.all([
        this.config.github ? createGitHubIssue(this.config.github, payload) : null,
        this.config.onSubmit ? this.config.onSubmit(payload) : null,
      ]);

      // If GitHub integration was used, include the issue URL in success message
      const issueUrl = results[0] as string | null;
      this.showSuccess(issueUrl);
    } catch {
      this.showError();
    }
  }

  private showSuccess(issueUrl?: string | null) {
    if (!this.modal) return;
    this.modal.setTitle('Thank you!');
    this.modal.setBackButton(null);

    const successIcon = h('div', { class: 'fw-success-icon' });
    successIcon.innerHTML = icons.check;

    const children: (HTMLElement | string)[] = [
      successIcon,
      h('h3', null, 'Feedback Sent'),
      h('p', null, 'Thank you for your feedback! We\'ll review it shortly.'),
    ];

    if (issueUrl) {
      const link = h('a', {
        href: issueUrl,
        target: '_blank',
        style: 'color:var(--fw-primary);font-size:13px;text-decoration:underline',
      }, 'View issue on GitHub');
      children.push(link);
    }

    const el = h('div', { class: 'fw-success' }, children);
    this.modal.setContent(el);

    setTimeout(() => this.close(), 3000);
  }

  private showError() {
    if (!this.modal) return;
    this.modal.setTitle('Error');

    const el = h('div', { style: 'text-align:center;padding:20px' }, [
      h('p', { style: 'color:#ef4444;margin-bottom:12px' }, 'Something went wrong. Please try again.'),
      h('button', {
        class: 'fw-btn fw-btn-primary',
        onClick: () => this.showDetailsStep(),
      }, 'Go Back'),
    ]);
    this.modal.setContent(el);
  }

  destroy() {
    if (this.annotationOverlay) {
      this.annotationOverlay.destroy();
    }
    if (this.modal) {
      this.modal.destroy();
    }
    this.trigger.destroy();
    this.shadowHost.destroy();
  }
}
