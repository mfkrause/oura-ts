// Main client
export { OuraClient, type OuraClientOptions } from './client/oura-client.js';

// OAuth
export {
  OuraOAuth,
  type OuraOAuthOptions,
  type OAuthScope,
  type TokenResponse,
  type AuthorizationUrlResult,
} from './oauth/oura-oauth.js';
export {
  loadTokens,
  saveTokens,
  deleteTokens,
  isTokenExpired,
  calculateExpiresAt,
  type StoredTokens,
} from './oauth/token-storage.js';
export { startCallbackServer, type CallbackResult, type CallbackServerOptions } from './oauth/callback-server.js';

// Errors
export {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  OuraError,
  RateLimitError,
  ValidationError,
} from './errors.js';

// Types
export type {
  // Core models
  DailyActivity,
  DailyCardiovascularAge,
  DailyReadiness,
  DailyResilience,
  DailySleep,
  DailySpO2,
  DailyStress,
  EnhancedTag,
  HeartRate,
  PersonalInfo,
  RestModePeriod,
  RingConfiguration,
  Session,
  Sleep,
  SleepTime,
  Tag,
  VO2Max,
  Workout,
  // Contributors
  ActivityContributors,
  ReadinessContributors,
  ResilienceContributors,
  SleepContributors,
  // Nested types
  DailySpO2AggregatedValues,
  ReadinessSummary,
  RestModeEpisode,
  Sample,
  SleepTimeWindow,
  // Enums
  DailyStressSummary,
  HeartRateSource,
  LongTermResilienceLevel,
  MomentMood,
  MomentType,
  RingColor,
  RingDesign,
  RingHardwareType,
  SleepAlgorithmVersion,
  SleepAnalysisReason,
  SleepTimeRecommendation,
  SleepTimeStatus,
  SleepType,
  WorkoutIntensity,
  WorkoutSource,
  // Webhooks
  WebhookSubscription,
  WebhookOperation,
  WebhookDataType,
  CreateWebhookSubscriptionRequest,
  UpdateWebhookSubscriptionRequest,
} from './types.js';

// Pagination
export type { PaginatedIterator, DateRangeOptions, DateTimeRangeOptions } from './client/pagination.js';

// Webhooks
export { WebhooksResource, type CreateWebhookOptions, type UpdateWebhookOptions } from './resources/webhooks.js';

// Decoders
export {
  decodeSleepPhases,
  decodeMovement,
  decodeActivityClass,
  type SleepPhase,
  type DecodedSleepPhase,
  type MovementLevel,
  type DecodedMovement,
  type ActivityClass,
  type DecodedActivityClass,
} from './helpers/decoders.js';
