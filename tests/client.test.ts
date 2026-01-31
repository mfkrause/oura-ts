import { describe, expect, it } from 'vitest';

import { OuraClient } from '../src/client/oura-client.js';
import { AuthenticationError, NotFoundError, RateLimitError } from '../src/errors.js';
import { mockDailyActivity, mockDailySleep, mockHeartrate, mockPersonalInfo, mockSleep } from './mocks/handlers.js';

describe('OuraClient', () => {
  const client = new OuraClient({ accessToken: 'test-token' });

  describe('personalInfo', () => {
    it('fetches personal info', async () => {
      const info = await client.personalInfo.get();
      expect(info).toEqual(mockPersonalInfo);
    });
  });

  describe('dailySleep', () => {
    it('fetches single document by id', async () => {
      const sleep = await client.dailySleep.get('test-id');
      expect(sleep.id).toBe('test-id');
      expect(sleep.score).toBe(mockDailySleep.score);
    });

    it('lists documents with pagination', async () => {
      const results: (typeof mockDailySleep)[] = [];
      for await (const item of client.dailySleep.list({ startDate: '2025-01-01' })) {
        results.push(item);
      }
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('sleep-doc-1');
      expect(results[1].id).toBe('sleep-doc-2');
    });

    it('collects all results with .all()', async () => {
      const results = await client.dailySleep.list({ startDate: '2025-01-01' }).all();
      expect(results).toHaveLength(2);
    });
  });

  describe('dailyActivity', () => {
    it('fetches activity with class_5_min field', async () => {
      const results = await client.dailyActivity.list({ startDate: '2025-01-01' }).all();
      expect(results).toHaveLength(1);
      expect(results[0].class_5_min).toBe(mockDailyActivity.class_5_min);
    });
  });

  describe('sleep', () => {
    it('fetches sleep periods with encoded fields', async () => {
      const results = await client.sleep.list({ startDate: '2025-01-01' }).all();
      expect(results).toHaveLength(1);
      expect(results[0].movement_30_sec).toBe(mockSleep.movement_30_sec);
      expect(results[0].sleep_phase_5_min).toBe(mockSleep.sleep_phase_5_min);
    });
  });

  describe('heartrate', () => {
    it('fetches heartrate data with datetime range', async () => {
      const results = await client.heartrate
        .list({
          startDatetime: '2025-01-15T00:00:00Z',
          endDatetime: '2025-01-15T23:59:59Z',
        })
        .all();
      expect(results).toHaveLength(2);
      expect(results[0].bpm).toBe(mockHeartrate.bpm);
    });
  });
});

describe('OuraClient error handling', () => {
  it('throws AuthenticationError for 401', async () => {
    const client = new OuraClient({ accessToken: 'invalid-token' });
    await expect(client.dailyReadiness.list({ startDate: '2025-01-01' }).all()).rejects.toThrow(AuthenticationError);
  });

  it('throws RateLimitError for 429 with retryAfter', async () => {
    const client = new OuraClient({ accessToken: 'rate-limited' });
    try {
      await client.dailyReadiness.list({ startDate: '2025-01-01' }).all();
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(RateLimitError);
      expect((error as RateLimitError).retryAfter).toBe(60);
    }
  });

  it('throws NotFoundError for 404', async () => {
    const client = new OuraClient({ accessToken: 'test-token' });
    await expect(client.dailyStress.get('not-found')).rejects.toThrow(NotFoundError);
  });
});
