export type FeedbackCategory = 'bug' | 'enhancement' | 'question' | 'other';
export type FeedbackPriority = 'low' | 'medium' | 'high';
export type AnnotationTool = 'draw' | 'highlight' | 'redact';

export interface FeedbackPayload {
  category: FeedbackCategory;
  title: string;
  description: string;
  priority: FeedbackPriority;
  email: string | null;
  screenshot: string | null;
  annotatedScreenshot: string | null;
  metadata: {
    url: string;
    userAgent: string;
    viewport: { width: number; height: number };
    timestamp: string;
  };
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  labels?: string[];
}

export interface FeedbackWidgetConfig {
  onSubmit?: (payload: FeedbackPayload) => void | Promise<void>;
  github?: GitHubConfig;
  triggerText?: string;
  theme?: { primaryColor?: string };
  zIndex?: number;
}

export interface WidgetState {
  step: 'idle' | 'category' | 'details' | 'screenshot' | 'annotating' | 'submitting';
  category: FeedbackCategory | null;
  title: string;
  description: string;
  priority: FeedbackPriority;
  email: string;
  screenshotCanvas: HTMLCanvasElement | null;
  screenshotDataUrl: string | null;
  annotatedDataUrl: string | null;
}

export type EventMap = {
  'open': void;
  'close': void;
  'category:select': FeedbackCategory;
  'details:complete': { title: string; description: string; priority: FeedbackPriority; email: string };
  'screenshot:capture': void;
  'screenshot:captured': HTMLCanvasElement;
  'screenshot:skip': void;
  'screenshot:annotate': void;
  'screenshot:annotated': string;
  'submit': void;
  'submitted': void;
  'error': string;
};
