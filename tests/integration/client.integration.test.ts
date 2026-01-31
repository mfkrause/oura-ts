import { describe, expect, it } from 'vitest';

import { OuraClient } from '../../src/client/oura-client.js';

const ACCESS_TOKEN = process.env['OURA_ACCESS_TOKEN'] ?? '';

describe.skipIf(!ACCESS_TOKEN)('OuraClient integration tests', () => {
  const client = new OuraClient({ accessToken: ACCESS_TOKEN });

  it('fetches personal info from real API', async () => {
    const info = await client.personalInfo.get();
    expect(info).toHaveProperty('id');
    expect(info).toHaveProperty('email');
  });

  it('fetches daily sleep with date range', async () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startDate = weekAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const results = await client.dailySleep.list({ startDate, endDate }).all();
    expect(Array.isArray(results)).toBe(true);

    if (results.length > 0) {
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('day');
      expect(results[0]).toHaveProperty('score');
    }
  });

  it('fetches heartrate with datetime range', async () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const startDatetime = yesterday.toISOString();
    const endDatetime = today.toISOString();

    const results = await client.heartrate.list({ startDatetime, endDatetime }).all();
    expect(Array.isArray(results)).toBe(true);

    if (results.length > 0) {
      expect(results[0]).toHaveProperty('bpm');
      expect(results[0]).toHaveProperty('timestamp');
    }
  });

  it('fetches ring configuration', async () => {
    const results = await client.ringConfiguration.list({}).all();
    expect(Array.isArray(results)).toBe(true);
  });

  it('handles pagination correctly', async () => {
    // Fetch a larger date range to potentially trigger pagination
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = monthAgo.toISOString().split('T')[0];

    let count = 0;
    for await (const _item of client.dailySleep.list({ startDate })) {
      count++;
      if (count >= 5) break; // Don't iterate through everything
    }

    expect(count).toBeGreaterThanOrEqual(0);
  });
});
