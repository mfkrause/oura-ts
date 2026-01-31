import { describe, expect, it } from 'vitest';

import { decodeActivityClass, decodeMovement, decodeSleepPhases } from './decoders.js';

describe('decodeSleepPhases', () => {
  it('decodes sleep phases correctly', () => {
    const result = decodeSleepPhases('1234');
    expect(result).toEqual([
      { minute: 0, phase: 'deep' },
      { minute: 5, phase: 'light' },
      { minute: 10, phase: 'rem' },
      { minute: 15, phase: 'awake' },
    ]);
  });

  it('returns empty array for null input', () => {
    expect(decodeSleepPhases(null)).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    expect(decodeSleepPhases()).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(decodeSleepPhases('')).toEqual([]);
  });
});

describe('decodeMovement', () => {
  it('decodes movement levels correctly', () => {
    const result = decodeMovement('1234');
    expect(result).toEqual([
      { second: 0, level: 'none' },
      { second: 30, level: 'restless' },
      { second: 60, level: 'tossing' },
      { second: 90, level: 'active' },
    ]);
  });

  it('returns empty array for null input', () => {
    expect(decodeMovement(null)).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    expect(decodeMovement()).toEqual([]);
  });
});

describe('decodeActivityClass', () => {
  it('decodes activity classes correctly', () => {
    const result = decodeActivityClass('012345');
    expect(result).toEqual([
      { minute: 0, activity: 'non_wear' },
      { minute: 5, activity: 'rest' },
      { minute: 10, activity: 'inactive' },
      { minute: 15, activity: 'low' },
      { minute: 20, activity: 'medium' },
      { minute: 25, activity: 'high' },
    ]);
  });

  it('returns empty array for null input', () => {
    expect(decodeActivityClass(null)).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    expect(decodeActivityClass()).toEqual([]);
  });
});
