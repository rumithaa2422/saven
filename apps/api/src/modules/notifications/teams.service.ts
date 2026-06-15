import { env } from '../../config/env.js';
import { HttpError } from '../../lib/http.js';

export async function sendTeamsMessage(input: { title: string; text: string }) {
  if (!env.TEAMS_WEBHOOK_URL) throw new HttpError(400, 'Teams webhook URL is not configured');

  const response = await fetch(env.TEAMS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.title, text: input.text })
  });

  if (!response.ok) throw new HttpError(502, 'Teams notification failed', await response.text());
  return { delivered: true };
}
