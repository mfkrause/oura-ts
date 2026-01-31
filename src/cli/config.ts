import { loadTokens, type StoredTokens } from '../oauth/token-storage.js';

export interface GlobalOptions {
  tokenFile?: string;
  sandbox?: boolean;
}

export async function getAccessToken(options: GlobalOptions): Promise<string> {
  // Check for direct token override via env var
  const envToken = process.env['OURA_ACCESS_TOKEN'];
  if (envToken) {
    return envToken;
  }

  // Load from token file
  const tokens = await loadTokens(options.tokenFile);
  if (!tokens) {
    throw new Error('Not authenticated. Run "oura auth login" first or set OURA_ACCESS_TOKEN environment variable.');
  }

  return tokens.accessToken;
}

export async function getStoredTokens(options: GlobalOptions): Promise<StoredTokens | null> {
  return loadTokens(options.tokenFile);
}
