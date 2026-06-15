import { env } from '../../config/env.js';
import { HttpError } from '../../lib/http.js';

export function getMicrosoftLoginUrl() {
  if (!env.MICROSOFT_CLIENT_ID || !env.MICROSOFT_REDIRECT_URI) {
    throw new HttpError(400, 'Microsoft login is not configured');
  }

  const url = new URL(`https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`);
  url.searchParams.set('client_id', env.MICROSOFT_CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', env.MICROSOFT_REDIRECT_URI);
  url.searchParams.set('response_mode', 'query');
  url.searchParams.set('scope', 'openid profile email User.Read');
  return url.toString();
}

export async function exchangeMicrosoftCode(_code: string) {
  // Production task:
  // 1. Exchange code with Microsoft token endpoint.
  // 2. Read user profile from Microsoft Graph.
  // 3. Validate domain against MICROSOFT_ALLOWED_DOMAINS.
  // 4. Create or link User.microsoftObjectId.
  // 5. Return signed application token.
  throw new HttpError(501, 'Microsoft callback structure is ready. Configure tenant, secret, and profile mapping.');
}
