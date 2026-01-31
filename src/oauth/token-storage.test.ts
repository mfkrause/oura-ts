import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { calculateExpiresAt, deleteTokens, isTokenExpired, loadTokens, saveTokens } from './token-storage.js';

describe('token-storage', () => {
  const testTokenFile = path.join(tmpdir(), `oura-test-token-${Date.now()}.json`);

  afterEach(async () => {
    try {
      await unlink(testTokenFile);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  describe('saveTokens and loadTokens', () => {
    it('saves and loads tokens correctly', async () => {
      const tokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: '2025-12-31T23:59:59.000Z',
      };

      await saveTokens(tokens, testTokenFile);
      const loaded = await loadTokens(testTokenFile);

      expect(loaded).toEqual(tokens);
    });

    it('saves and loads tokens with client credentials', async () => {
      const tokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: '2025-12-31T23:59:59.000Z',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      await saveTokens(tokens, testTokenFile);
      const loaded = await loadTokens(testTokenFile);

      expect(loaded).toEqual(tokens);
    });

    it('returns null for non-existent file', async () => {
      const loaded = await loadTokens('/non/existent/path.json');
      expect(loaded).toBeNull();
    });
  });

  describe('deleteTokens', () => {
    it('deletes existing token file', async () => {
      await writeFile(testTokenFile, '{}');
      await deleteTokens(testTokenFile);

      const loaded = await loadTokens(testTokenFile);
      expect(loaded).toBeNull();
    });

    it('does not throw for non-existent file', async () => {
      await expect(deleteTokens('/non/existent/path.json')).resolves.not.toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('returns true for expired token', () => {
      const pastDate = new Date(Date.now() - 60_000).toISOString();
      expect(isTokenExpired(pastDate)).toBe(true);
    });

    it('returns true for token expiring within 5 minutes', () => {
      const soonDate = new Date(Date.now() + 2 * 60_000).toISOString();
      expect(isTokenExpired(soonDate)).toBe(true);
    });

    it('returns false for token expiring after 5 minutes', () => {
      const futureDate = new Date(Date.now() + 10 * 60_000).toISOString();
      expect(isTokenExpired(futureDate)).toBe(false);
    });
  });

  describe('calculateExpiresAt', () => {
    it('calculates expiration time correctly', () => {
      const before = Date.now();
      const expiresAt = calculateExpiresAt(3600); // 1 hour
      const after = Date.now();

      const expiryTime = new Date(expiresAt).getTime();
      expect(expiryTime).toBeGreaterThanOrEqual(before + 3_600_000);
      expect(expiryTime).toBeLessThanOrEqual(after + 3_600_000);
    });
  });
});
