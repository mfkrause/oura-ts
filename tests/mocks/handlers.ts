import { HttpResponse, http } from 'msw';

const BASE_URL = 'https://api.ouraring.com/v2';

// Sample response data matching Oura API shapes
export const mockPersonalInfo = {
  id: 'test-user-id',
  age: 30,
  weight: 70,
  height: 1.75,
  biological_sex: 'male',
  email: 'test@example.com',
};

export const mockDailySleep = {
  id: 'sleep-doc-1',
  contributors: {
    deep_sleep: 80,
    efficiency: 90,
    latency: 85,
    rem_sleep: 75,
    restfulness: 70,
    timing: 60,
    total_sleep: 85,
  },
  day: '2025-01-15',
  score: 82,
  timestamp: '2025-01-15T00:00:00+00:00',
};

export const mockDailyActivity = {
  id: 'activity-doc-1',
  class_5_min: '011122233344455',
  score: 75,
  active_calories: 450,
  average_met_minutes: 1.5,
  contributors: {
    meet_daily_targets: 80,
    move_every_hour: 70,
    recovery_time: 90,
    stay_active: 75,
    training_frequency: 65,
    training_volume: 70,
  },
  equivalent_walking_distance: 8500,
  high_activity_met_minutes: 45,
  high_activity_time: 1800,
  inactivity_alerts: 2,
  low_activity_met_minutes: 120,
  low_activity_time: 7200,
  medium_activity_met_minutes: 90,
  medium_activity_time: 3600,
  met: {
    interval: 60,
    items: [1, 1.2, 1.5],
    timestamp: '2025-01-15T00:00:00+00:00',
  },
  meters_to_target: 0,
  non_wear_time: 3600,
  resting_time: 28_800,
  sedentary_met_minutes: 400,
  sedentary_time: 36_000,
  steps: 10_000,
  target_calories: 500,
  target_meters: 8000,
  total_calories: 2200,
  day: '2025-01-15',
  timestamp: '2025-01-15T00:00:00+00:00',
};

export const mockSleep = {
  id: 'sleep-period-1',
  average_breath: 14.5,
  average_heart_rate: 55,
  average_hrv: 45,
  awake_time: 1800,
  bedtime_end: '2025-01-15T07:30:00+00:00',
  bedtime_start: '2025-01-14T23:00:00+00:00',
  day: '2025-01-15',
  deep_sleep_duration: 5400,
  efficiency: 92,
  latency: 600,
  light_sleep_duration: 14_400,
  low_battery_alert: false,
  lowest_heart_rate: 48,
  movement_30_sec: '111122221111',
  period: 0,
  readiness: {
    contributors: {
      activity_balance: 80,
      body_temperature: 90,
      hrv_balance: 75,
      previous_day_activity: 85,
      previous_night: 88,
      recovery_index: 82,
      resting_heart_rate: 90,
      sleep_balance: 78,
    },
    score: 85,
    temperature_deviation: -0.2,
    temperature_trend_deviation: 0.1,
  },
  readiness_score_delta: 5,
  rem_sleep_duration: 5400,
  restless_periods: 3,
  sleep_phase_5_min: '44432211144',
  sleep_score_delta: 3,
  time_in_bed: 30_600,
  total_sleep_duration: 25_200,
  type: 'long_sleep',
};

export const mockHeartrate = {
  bpm: 72,
  source: 'awake',
  timestamp: '2025-01-15T10:00:00+00:00',
};

export const handlers = [
  // Personal Info
  http.get(`${BASE_URL}/usercollection/personal_info`, () => {
    return HttpResponse.json(mockPersonalInfo);
  }),

  // Daily Sleep - list
  http.get(`${BASE_URL}/usercollection/daily_sleep`, ({ request }) => {
    const url = new URL(request.url);
    const nextToken = url.searchParams.get('next_token');

    if (nextToken === 'page2') {
      return HttpResponse.json({
        data: [{ ...mockDailySleep, id: 'sleep-doc-2', day: '2025-01-16' }],
        next_token: null,
      });
    }

    return HttpResponse.json({
      data: [mockDailySleep],
      next_token: 'page2',
    });
  }),

  // Daily Sleep - single
  http.get(`${BASE_URL}/usercollection/daily_sleep/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockDailySleep, id: params.id });
  }),

  // Daily Activity - list
  http.get(`${BASE_URL}/usercollection/daily_activity`, () => {
    return HttpResponse.json({
      data: [mockDailyActivity],
      next_token: null,
    });
  }),

  // Daily Activity - single
  http.get(`${BASE_URL}/usercollection/daily_activity/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockDailyActivity, id: params.id });
  }),

  // Sleep - list
  http.get(`${BASE_URL}/usercollection/sleep`, () => {
    return HttpResponse.json({
      data: [mockSleep],
      next_token: null,
    });
  }),

  // Sleep - single
  http.get(`${BASE_URL}/usercollection/sleep/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockSleep, id: params.id });
  }),

  // Heartrate
  http.get(`${BASE_URL}/usercollection/heartrate`, () => {
    return HttpResponse.json({
      data: [mockHeartrate, { ...mockHeartrate, timestamp: '2025-01-15T10:05:00+00:00', bpm: 75 }],
      next_token: null,
    });
  }),

  // Error scenarios
  http.get(`${BASE_URL}/usercollection/daily_readiness`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid-token') {
      return HttpResponse.json({ detail: 'Invalid token' }, { status: 401 });
    }
    if (auth === 'Bearer rate-limited') {
      return HttpResponse.json({ detail: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '60' } });
    }
    return HttpResponse.json({ data: [], next_token: null });
  }),

  // 404 for unknown document
  http.get(`${BASE_URL}/usercollection/daily_stress/not-found`, () => {
    return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
  }),
];
