import { h } from '../utils/dom';
import { icons } from '../utils/icons';
import type { FeedbackPriority } from '../types';

export interface DetailsData {
  title: string;
  description: string;
  priority: FeedbackPriority;
  email: string;
}

export class DetailsStep {
  readonly el: HTMLDivElement;
  private titleInput!: HTMLInputElement;
  private descInput!: HTMLTextAreaElement;
  private emailInput!: HTMLInputElement;
  private priority: FeedbackPriority = 'medium';
  private priorityBtns: HTMLButtonElement[] = [];

  constructor(
    onSubmit: (data: DetailsData) => void,
    onCapture: () => void,
    hasScreenshot: boolean,
  ) {
    this.el = h('div', { class: 'fw-form' });
    this.buildForm(onSubmit, onCapture, hasScreenshot);
  }

  private buildForm(
    onSubmit: (data: DetailsData) => void,
    onCapture: () => void,
    hasScreenshot: boolean,
  ) {
    // Title
    this.titleInput = h('input', { type: 'text', placeholder: 'Brief summary of your feedback' }) as HTMLInputElement;
    const titleField = h('div', { class: 'fw-field' }, [
      h('label', null, 'Title'),
      this.titleInput,
    ]);

    // Description
    this.descInput = h('textarea', { placeholder: 'Describe in detail...' }) as HTMLTextAreaElement;
    const descField = h('div', { class: 'fw-field' }, [
      h('label', null, 'Description'),
      this.descInput,
    ]);

    // Priority
    const priorities: { value: FeedbackPriority; label: string }[] = [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ];
    const priorityGroup = h('div', { class: 'fw-priority-group' });
    for (const p of priorities) {
      const btn = h('button', {
        class: `fw-priority-btn${p.value === this.priority ? ' active' : ''}`,
        onClick: () => this.setPriority(p.value),
      }, p.label) as HTMLButtonElement;
      btn.setAttribute('type', 'button');
      this.priorityBtns.push(btn);
      priorityGroup.appendChild(btn);
    }
    const priorityField = h('div', { class: 'fw-field' }, [
      h('label', null, 'Priority'),
      priorityGroup,
    ]);

    // Email
    this.emailInput = h('input', { type: 'email', placeholder: 'you@example.com' }) as HTMLInputElement;
    const emailField = h('div', { class: 'fw-field' }, [
      h('label', null, [
        'Email ',
        h('span', { class: 'fw-optional' }, '(optional)'),
      ]),
      this.emailInput,
    ]);

    // Screenshot button
    const screenshotBtn = h('button', {
      class: 'fw-btn fw-btn-secondary',
      onClick: onCapture,
      type: 'button',
    });
    screenshotBtn.innerHTML = icons.camera;
    screenshotBtn.appendChild(document.createTextNode(hasScreenshot ? ' Retake Screenshot' : ' Capture Screenshot'));

    // Submit button
    const submitBtn = h('button', {
      class: 'fw-btn fw-btn-primary',
      type: 'button',
      onClick: () => {
        if (!this.validate()) return;
        onSubmit({
          title: this.titleInput.value.trim(),
          description: this.descInput.value.trim(),
          priority: this.priority,
          email: this.emailInput.value.trim(),
        });
      },
    }, 'Submit Feedback') as HTMLButtonElement;

    const actions = h('div', { class: 'fw-actions fw-actions-spread' }, [
      screenshotBtn,
      submitBtn,
    ]);

    this.el.appendChild(titleField);
    this.el.appendChild(descField);
    this.el.appendChild(priorityField);
    this.el.appendChild(emailField);
    this.el.appendChild(actions);
  }

  private setPriority(value: FeedbackPriority) {
    this.priority = value;
    for (const btn of this.priorityBtns) {
      const isActive = btn.textContent?.toLowerCase() === value;
      btn.classList.toggle('active', isActive);
    }
  }

  private validate(): boolean {
    let valid = true;

    // Clear previous errors
    for (const err of Array.from(this.el.querySelectorAll('.fw-error'))) {
      err.remove();
    }

    if (!this.titleInput.value.trim()) {
      this.showError(this.titleInput, 'Title is required');
      valid = false;
    }
    if (!this.descInput.value.trim()) {
      this.showError(this.descInput, 'Description is required');
      valid = false;
    }

    return valid;
  }

  private showError(input: HTMLElement, message: string) {
    const err = h('div', { class: 'fw-error' }, message);
    input.parentElement?.appendChild(err);
    input.style.borderColor = '#ef4444';
    input.addEventListener('input', () => {
      input.style.borderColor = '';
      err.remove();
    }, { once: true });
  }
}
