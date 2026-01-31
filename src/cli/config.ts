import { OuraOAuth } from '../oauth/oura-oauth.js';
import {
  type StoredTokens,
  calculateExpiresAt,
  isTokenExpired,
  loadTokens,
  saveTokens,
} from '../oauth/token-storage.js';

export interface GlobalOptions {
  tokenFile?: string;
  sandbox?: boolean;
}

async function refreshTokensIfNeeded(tokens: StoredTokens, tokenFilePath?: string): Promise<StoredTokens> {
  if (!isTokenExpired(tokens.expiresAt)) {
    return tokens;
  }

  if (!tokens.clientId || !tokens.clientSecret) {
    throw new Error('Token expired and no client credentials stored. Run "oura auth login" to re-authenticate.');
  }

  const oauth = new OuraOAuth({
    clientId: tokens.clientId,
    clientSecret: tokens.clientSecret,
    redirectUri: '', // Not used for refresh
  });

  const newTokens = await oauth.refreshAccessToken(tokens.refreshToken);

  const refreshedTokens: StoredTokens = {
    accessToken: newTokens.access_token,
    refreshToken: newTokens.refresh_token,
    expiresAt: calculateExpiresAt(newTokens.expires_in),
    clientId: tokens.clientId,
    clientSecret: tokens.clientSecret,
  };

  await saveTokens(refreshedTokens, tokenFilePath);

  return refreshedTokens;
}

export async function getAccessToken(options: GlobalOptions): Promise<string> {
  const environmentToken = process.env['OURA_ACCESS_TOKEN'];
  if (environmentToken) {
    return environmentToken;
  }

  const tokens = await loadTokens(options.tokenFile);
  if (!tokens) {
    throw new Error('Not authenticated. Run "oura auth login" first or set OURA_ACCESS_TOKEN environment variable.');
  }

  const validTokens = await refreshTokensIfNeeded(tokens, options.tokenFile);
  return validTokens.accessToken;
}

export async function getStoredTokens(options: GlobalOptions): Promise<StoredTokens | null> {
  return loadTokens(options.tokenFile);
}
