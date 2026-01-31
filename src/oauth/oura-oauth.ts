import { randomBytes } from 'node:crypto';

const AUTHORIZATION_URL = 'https://cloud.ouraring.com/oauth/authorize';
const TOKEN_URL = 'https://api.ouraring.com/oauth/token';
const REVOKE_URL = 'https://api.ouraring.com/oauth/revoke';

export type OAuthScope = 'email' | 'personal' | 'daily' | 'heartrate' | 'workout' | 'tag' | 'session' | 'spo2';

export interface OuraOAuthOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: OAuthScope[];
}

export interface TokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface AuthorizationUrlResult {
  url: string;
  state: string;
}

export class OuraOAuth {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: OAuthScope[];

  constructor(options: OuraOAuthOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.scopes = options.scopes ?? ['daily', 'personal', 'heartrate', 'workout', 'tag', 'session', 'spo2'];
  }

  getAuthorizationUrl(state?: string): AuthorizationUrlResult {
    const generatedState = state ?? randomBytes(16).toString('hex');
    const parameters = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      state: generatedState,
    });

    return {
      url: `${AUTHORIZATION_URL}?${parameters.toString()}`,
      state: generatedState,
    };
  }

  async exchangeCode(code: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code: ${error}`);
    }

    return response.json() as Promise<TokenResponse>;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh token: ${error}`);
    }

    return response.json() as Promise<TokenResponse>;
  }

  async revokeAccessToken(accessToken: string): Promise<void> {
    const url = `${REVOKE_URL}?access_token=${encodeURIComponent(accessToken)}`;

    const response = await fetch(url, { method: 'POST' });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to revoke token: ${error}`);
    }
  }
}
