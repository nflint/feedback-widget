import type { GitHubConfig, FeedbackPayload } from '../types';

const API_BASE = 'https://api.github.com';

async function githubFetch(
  config: GitHubConfig,
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }
  return res;
}

function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(',')[1] || '';
}

async function uploadScreenshot(
  config: GitHubConfig,
  dataUrl: string,
): Promise<string> {
  const timestamp = Date.now();
  const path = `feedback-screenshots/${timestamp}.png`;
  const base64 = dataUrlToBase64(dataUrl);

  const res = await githubFetch(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${path}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: `Add feedback screenshot ${timestamp}`,
        content: base64,
      }),
    },
  );

  const data = await res.json();
  return data.content.download_url;
}

function buildIssueBody(
  payload: FeedbackPayload,
  screenshotUrl?: string,
): string {
  const priorityEmoji: Record<string, string> = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  const lines: string[] = [
    payload.description,
    '',
    '---',
    '',
    `**Category:** ${payload.category}`,
    `**Priority:** ${priorityEmoji[payload.priority] || ''} ${payload.priority}`,
    `**Page:** ${payload.metadata.url}`,
    `**Viewport:** ${payload.metadata.viewport.width}x${payload.metadata.viewport.height}`,
    `**Browser:** ${payload.metadata.userAgent}`,
    `**Reported:** ${payload.metadata.timestamp}`,
  ];

  if (payload.email) {
    lines.push(`**Reporter:** ${payload.email}`);
  }

  if (screenshotUrl) {
    lines.push('', '### Screenshot', '', `![Screenshot](${screenshotUrl})`);
  }

  return lines.join('\n');
}

/**
 * Creates a GitHub issue from a feedback payload.
 * If a screenshot is present, uploads it to the repo first.
 * Returns the HTML URL of the created issue.
 */
export async function createGitHubIssue(
  config: GitHubConfig,
  payload: FeedbackPayload,
): Promise<string> {
  // Upload screenshot if present
  let screenshotUrl: string | undefined;
  const screenshot = payload.annotatedScreenshot || payload.screenshot;
  if (screenshot) {
    screenshotUrl = await uploadScreenshot(config, screenshot);
  }

  // Build labels
  const labels: string[] = [payload.category];
  if (config.labels) {
    labels.push(...config.labels);
  }
  labels.push(`priority:${payload.priority}`);

  // Create issue
  const body = buildIssueBody(payload, screenshotUrl);
  const res = await githubFetch(
    config,
    `/repos/${config.owner}/${config.repo}/issues`,
    {
      method: 'POST',
      body: JSON.stringify({
        title: `[${payload.category}] ${payload.title}`,
        body,
        labels,
      }),
    },
  );

  const issue = await res.json();
  return issue.html_url;
}
