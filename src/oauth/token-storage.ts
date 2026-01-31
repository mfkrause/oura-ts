import { readFile, writeFile, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DEFAULT_TOKEN_FILE = '.oura_token';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  clientId?: string;
  clientSecret?: string;
}

function getTokenFilePath(): string {
  if (process.env['OURA_TOKEN_FILE']) {
    return process.env['OURA_TOKEN_FILE'];
  }
  return join(homedir(), DEFAULT_TOKEN_FILE);
}

export async function loadTokens(tokenFilePath?: string): Promise<StoredTokens | null> {
  const filePath = tokenFilePath ?? getTokenFilePath();

  try {
    const content = await readFile(filePath, 'utf8');
    const data = JSON.parse(content) as Record<string, unknown>;

    return {
      accessToken: data['access_token'] as string,
      refreshToken: data['refresh_token'] as string,
      expiresAt: data['expiry'] as string,
      clientId: data['client_id'] as string | undefined,
      clientSecret: data['client_secret'] as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function saveTokens(tokens: StoredTokens, tokenFilePath?: string): Promise<void> {
  const filePath = tokenFilePath ?? getTokenFilePath();

  const data: Record<string, string | undefined> = {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry: tokens.expiresAt,
  };

  if (tokens.clientId) {
    data['client_id'] = tokens.clientId;
  }
  if (tokens.clientSecret) {
    data['client_secret'] = tokens.clientSecret;
  }

  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export async function deleteTokens(tokenFilePath?: string): Promise<void> {
  const filePath = tokenFilePath ?? getTokenFilePath();

  try {
    await unlink(filePath);
  } catch {
    // Ignore if file doesn't exist
  }
}

export function isTokenExpired(expiresAt: string): boolean {
  const expiry = new Date(expiresAt);
  const now = new Date();
  // Consider expired if less than 5 minutes remaining
  return expiry.getTime() - now.getTime() < 5 * 60 * 1000;
}

export function calculateExpiresAt(expiresIn: number): string {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  return expiresAt.toISOString();
}
