import { type HttpClientOptions, createHttpClient } from './http.js';
import { DailyActivityResource } from '../resources/daily-activity.js';
import { DailyCardiovascularAgeResource } from '../resources/daily-cardiovascular-age.js';
import { DailyReadinessResource } from '../resources/daily-readiness.js';
import { DailyResilienceResource } from '../resources/daily-resilience.js';
import { DailySleepResource } from '../resources/daily-sleep.js';
import { DailySpO2Resource } from '../resources/daily-spo2.js';
import { DailyStressResource } from '../resources/daily-stress.js';
import { EnhancedTagResource } from '../resources/enhanced-tag.js';
import { HeartRateResource } from '../resources/heartrate.js';
import { PersonalInfoResource } from '../resources/personal-info.js';
import { RestModePeriodResource } from '../resources/rest-mode-period.js';
import { RingConfigurationResource } from '../resources/ring-configuration.js';
import { SessionResource } from '../resources/session.js';
import { SleepTimeResource } from '../resources/sleep-time.js';
import { SleepResource } from '../resources/sleep.js';
import { TagResource } from '../resources/tag.js';
import { VO2MaxResource } from '../resources/vo2-max.js';
import { WorkoutResource } from '../resources/workout.js';

export type OuraClientOptions = HttpClientOptions;

export class OuraClient {
  readonly personalInfo: PersonalInfoResource;
  readonly dailyActivity: DailyActivityResource;
  readonly dailyCardiovascularAge: DailyCardiovascularAgeResource;
  readonly dailyReadiness: DailyReadinessResource;
  readonly dailyResilience: DailyResilienceResource;
  readonly dailySleep: DailySleepResource;
  readonly dailySpO2: DailySpO2Resource;
  readonly dailyStress: DailyStressResource;
  readonly enhancedTag: EnhancedTagResource;
  readonly heartrate: HeartRateResource;
  readonly restModePeriod: RestModePeriodResource;
  readonly ringConfiguration: RingConfigurationResource;
  readonly session: SessionResource;
  readonly sleep: SleepResource;
  readonly sleepTime: SleepTimeResource;
  readonly tag: TagResource;
  readonly vo2Max: VO2MaxResource;
  readonly workout: WorkoutResource;

  constructor(options: OuraClientOptions) {
    const httpClient = createHttpClient(options);

    this.personalInfo = new PersonalInfoResource(httpClient);
    this.dailyActivity = new DailyActivityResource(httpClient);
    this.dailyCardiovascularAge = new DailyCardiovascularAgeResource(httpClient);
    this.dailyReadiness = new DailyReadinessResource(httpClient);
    this.dailyResilience = new DailyResilienceResource(httpClient);
    this.dailySleep = new DailySleepResource(httpClient);
    this.dailySpO2 = new DailySpO2Resource(httpClient);
    this.dailyStress = new DailyStressResource(httpClient);
    this.enhancedTag = new EnhancedTagResource(httpClient);
    this.heartrate = new HeartRateResource(httpClient);
    this.restModePeriod = new RestModePeriodResource(httpClient);
    this.ringConfiguration = new RingConfigurationResource(httpClient);
    this.session = new SessionResource(httpClient);
    this.sleep = new SleepResource(httpClient);
    this.sleepTime = new SleepTimeResource(httpClient);
    this.tag = new TagResource(httpClient);
    this.vo2Max = new VO2MaxResource(httpClient);
    this.workout = new WorkoutResource(httpClient);
  }
}
