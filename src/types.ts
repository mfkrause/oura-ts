import type { components } from './generated/types.js';

// Core data models
export type DailyActivity = components['schemas']['DailyActivityModel'];
export type DailyCardiovascularAge = components['schemas']['DailyCardiovascularAgeModel'];
export type DailyReadiness = components['schemas']['DailyReadinessModel'];
export type DailyResilience = components['schemas']['DailyResilienceModel'];
export type DailySleep = components['schemas']['DailySleepModel'];
export type DailySpO2 = components['schemas']['DailySpO2Model'];
export type DailyStress = components['schemas']['DailyStressModel'];
export type EnhancedTag = components['schemas']['EnhancedTagModel'];
export type HeartRate = components['schemas']['HeartRateModel'];
export type PersonalInfo = components['schemas']['PersonalInfoResponse'];
export type RestModePeriod = components['schemas']['RestModePeriodModel'];
export type RingConfiguration = components['schemas']['RingConfigurationModel'];
export type Session = components['schemas']['SessionModel'];
export type Sleep = components['schemas']['SleepModel'];
export type SleepTime = components['schemas']['SleepTimeModel'];
export type Tag = components['schemas']['TagModel'];
export type VO2Max = components['schemas']['VO2MaxModel'];
export type Workout = components['schemas']['PublicWorkout'];

// Contributors
export type ActivityContributors = components['schemas']['ActivityContributors'];
export type ReadinessContributors = components['schemas']['ReadinessContributors'];
export type ResilienceContributors = components['schemas']['ResilienceContributors'];
export type SleepContributors = components['schemas']['SleepContributors'];

// Nested types
export type DailySpO2AggregatedValues = components['schemas']['DailySpO2AggregatedValuesModel'];
export type ReadinessSummary = components['schemas']['ReadinessSummary'];
export type RestModeEpisode = components['schemas']['RestModeEpisode'];
export type Sample = components['schemas']['SampleModel'];
export type SleepTimeWindow = components['schemas']['SleepTimeWindow'];

// Enums
export type DailyStressSummary = components['schemas']['DailyStressSummary'];
export type HeartRateSource = components['schemas']['HeartRateSource'];
export type LongTermResilienceLevel = components['schemas']['LongTermResilienceLevel'];
export type MomentMood = components['schemas']['MomentMood'];
export type MomentType = components['schemas']['MomentType'];
export type RingColor = components['schemas']['RingColor'];
export type RingDesign = components['schemas']['RingDesign'];
export type RingHardwareType = components['schemas']['RingHardwareType'];
export type SleepAlgorithmVersion = components['schemas']['SleepAlgorithmVersion'];
export type SleepAnalysisReason = components['schemas']['SleepAnalysisReason'];
export type SleepTimeRecommendation = components['schemas']['SleepTimeRecommendation'];
export type SleepTimeStatus = components['schemas']['SleepTimeStatus'];
export type SleepType = components['schemas']['SleepType'];
export type WorkoutIntensity = components['schemas']['PublicWorkoutIntensity'];
export type WorkoutSource = components['schemas']['PublicWorkoutSource'];

// Webhook types
export type WebhookSubscription = components['schemas']['WebhookSubscriptionModel'];
export type WebhookOperation = components['schemas']['WebhookOperation'];
export type WebhookDataType = components['schemas']['ExtApiV2DataType'];
export type CreateWebhookSubscriptionRequest = components['schemas']['CreateWebhookSubscriptionRequest'];
export type UpdateWebhookSubscriptionRequest = components['schemas']['UpdateWebhookSubscriptionRequest'];

// Validation
export type ValidationError = components['schemas']['ValidationError'];
export type HTTPValidationError = components['schemas']['HTTPValidationError'];
