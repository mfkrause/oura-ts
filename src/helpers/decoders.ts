export type SleepPhase = 'deep' | 'light' | 'rem' | 'awake';

export interface DecodedSleepPhase {
  minute: number;
  phase: SleepPhase;
}

export type MovementLevel = 'none' | 'restless' | 'tossing' | 'active';

export interface DecodedMovement {
  second: number;
  level: MovementLevel;
}

export type ActivityClass = 'non_wear' | 'rest' | 'inactive' | 'low' | 'medium' | 'high';

export interface DecodedActivityClass {
  minute: number;
  activity: ActivityClass;
}

const SLEEP_PHASE_MAP: Record<string, SleepPhase> = {
  '1': 'deep',
  '2': 'light',
  '3': 'rem',
  '4': 'awake',
};

const MOVEMENT_MAP: Record<string, MovementLevel> = {
  '1': 'none',
  '2': 'restless',
  '3': 'tossing',
  '4': 'active',
};

const ACTIVITY_CLASS_MAP: Record<string, ActivityClass> = {
  '0': 'non_wear',
  '1': 'rest',
  '2': 'inactive',
  '3': 'low',
  '4': 'medium',
  '5': 'high',
};

/**
 * Decodes the sleep_phase_5_min encoded string from Sleep data.
 * Each character represents a 5-minute interval:
 * - '1' = deep sleep
 * - '2' = light sleep
 * - '3' = REM sleep
 * - '4' = awake
 */
export function decodeSleepPhases(encoded: string | null | undefined): DecodedSleepPhase[] {
  if (!encoded) {
    return [];
  }

  return [...encoded].map((char, index) => ({
    minute: index * 5,
    phase: SLEEP_PHASE_MAP[char] ?? 'awake',
  }));
}

/**
 * Decodes the movement_30_sec encoded string from Sleep data.
 * Each character represents a 30-second interval:
 * - '1' = no motion
 * - '2' = restless
 * - '3' = tossing and turning
 * - '4' = active
 */
export function decodeMovement(encoded: string | null | undefined): DecodedMovement[] {
  if (!encoded) {
    return [];
  }

  return [...encoded].map((char, index) => ({
    second: index * 30,
    level: MOVEMENT_MAP[char] ?? 'none',
  }));
}

/**
 * Decodes the class_5_min encoded string from DailyActivity data.
 * Each character represents a 5-minute interval:
 * - '0' = non-wear
 * - '1' = rest
 * - '2' = inactive
 * - '3' = low activity
 * - '4' = medium activity
 * - '5' = high activity
 */
export function decodeActivityClass(encoded: string | null | undefined): DecodedActivityClass[] {
  if (!encoded) {
    return [];
  }

  return [...encoded].map((char, index) => ({
    minute: index * 5,
    activity: ACTIVITY_CLASS_MAP[char] ?? 'non_wear',
  }));
}
