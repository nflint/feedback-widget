import { Widget } from './widget';
import type { FeedbackWidgetConfig, FeedbackPayload, GitHubConfig } from './types';

let instance: Widget | null = null;

const FeedbackWidget = {
  init(config: FeedbackWidgetConfig) {
    if (instance) {
      instance.destroy();
    }
    instance = new Widget(config);
  },

  destroy() {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  },
};

// Expose on window for IIFE usage
(window as unknown as Record<string, unknown>).FeedbackWidget = FeedbackWidget;

export { FeedbackWidget };
export type { FeedbackWidgetConfig, FeedbackPayload, GitHubConfig };
