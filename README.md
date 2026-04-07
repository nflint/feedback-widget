# Feedback Widget

A standalone, framework-agnostic feedback widget that can be dropped into any web page via a single `<script>` tag. Collects structured feedback with screenshot capture, annotation tools, and optional GitHub Issues integration.

## Features

- **Zero dependencies on frameworks** — works on any website
- **Screenshot capture** — captures the current page using html2canvas
- **Annotation tools** — draw, highlight, and redact directly on screenshots
- **Categorized feedback** — Bug, Enhancement, Question, or Other
- **Structured form** — title, description, priority, and optional email
- **GitHub Issues integration** — creates issues with embedded screenshots automatically
- **Shadow DOM isolated** — widget styles never leak to or from your page
- **Single file** — one `<script>` tag, ~60KB gzipped

## Quick Start

```html
<script src="feedback-widget.js"></script>
<script>
  FeedbackWidget.init({
    onSubmit: function(payload) {
      console.log('Feedback:', payload);
      // Send to your backend
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  });
</script>
```

## GitHub Issues Integration

Send feedback directly to a GitHub repo as issues with embedded screenshots:

```html
<script src="feedback-widget.js"></script>
<script>
  FeedbackWidget.init({
    github: {
      token: 'ghp_your_personal_access_token', // PAT with repo scope
      owner: 'your-org',
      repo: 'your-repo',
      labels: ['feedback']  // optional extra labels
    }
  });
</script>
```

Each submission creates a GitHub issue with:
- Title prefixed by category (e.g. `[bug] Button misaligned`)
- Markdown body with description, page URL, browser info, viewport size
- Screenshot uploaded to `feedback-screenshots/` in the repo and embedded in the issue
- Auto-applied labels for category and priority

You can provide both `github` and `onSubmit` — both will fire on submission.

## Configuration

```js
FeedbackWidget.init({
  // Send feedback to a custom backend (optional if github is provided)
  onSubmit: (payload) => Promise<void> | void,

  // Send feedback to GitHub Issues (optional if onSubmit is provided)
  github: {
    token: string,       // Personal access token with repo scope
    owner: string,       // Repository owner
    repo: string,        // Repository name
    labels: string[],    // Additional labels to apply (optional)
  },

  // Button text (default: "Feedback")
  triggerText: string,

  // Theme customization
  theme: {
    primaryColor: string,  // Accent color for buttons/inputs (default: "#6366f1")
  },

  // Z-index for the widget (default: 999999)
  zIndex: number,
});

// Remove the widget from the page
FeedbackWidget.destroy();
```

## Payload Shape

```typescript
interface FeedbackPayload {
  category: 'bug' | 'enhancement' | 'question' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  email: string | null;
  screenshot: string | null;           // base64 data URL (original)
  annotatedScreenshot: string | null;  // base64 data URL (with annotations)
  metadata: {
    url: string;
    userAgent: string;
    viewport: { width: number; height: number };
    timestamp: string;  // ISO 8601
  };
}
```

## Development

```bash
npm install
npm run dev      # Start Vite dev server
npm run build    # Build to dist/feedback-widget.js
```

## How It Works

1. User clicks the red "Feedback" tab on the left edge of the page
2. Selects a category (Bug, Enhancement, Question, Other)
3. Fills in title, description, priority, and optional email
4. Optionally captures and annotates a screenshot
5. Submits — payload is sent via the configured integration(s)
