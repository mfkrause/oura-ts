# oura-ts

TypeScript library and CLI for the Oura Ring API v2.

## Installation

```bash
pnpm add oura-ts
```

## Library Usage

### Basic Usage

```typescript
import { OuraClient } from 'oura-ts';

const client = new OuraClient({
  accessToken: 'your-access-token',
});

// Get personal info
const info = await client.personalInfo.get();

// Get a single document by ID
const activity = await client.dailyActivity.get('document-id');

// List with date range (async iterator)
for await (const sleep of client.dailySleep.list({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
})) {
  console.log(sleep.score);
}

// Collect all results at once
const allSleep = await client.dailySleep.list({ startDate: '2025-01-01' }).all();
```

### Available Resources

| Resource | Methods | Parameters |
|----------|---------|------------|
| `personalInfo` | `get()` | - |
| `dailyActivity` | `get(id)`, `list(options)` | date range |
| `dailyCardiovascularAge` | `get(id)`, `list(options)` | date range |
| `dailyReadiness` | `get(id)`, `list(options)` | date range |
| `dailyResilience` | `get(id)`, `list(options)` | date range |
| `dailySleep` | `get(id)`, `list(options)` | date range |
| `dailySpO2` | `get(id)`, `list(options)` | date range |
| `dailyStress` | `get(id)`, `list(options)` | date range |
| `enhancedTag` | `get(id)`, `list(options)` | date range |
| `heartrate` | `list(options)` | datetime range |
| `restModePeriod` | `get(id)`, `list(options)` | date range |
| `ringConfiguration` | `get(id)`, `list(options)` | date range |
| `session` | `get(id)`, `list(options)` | date range |
| `sleep` | `get(id)`, `list(options)` | date range |
| `sleepTime` | `get(id)`, `list(options)` | date range |
| `tag` | `get(id)`, `list(options)` | date range |
| `vo2Max` | `get(id)`, `list(options)` | date range |
| `workout` | `get(id)`, `list(options)` | date range |

### OAuth Flow

```typescript
import { OuraOAuth } from 'oura-ts';

const oauth = new OuraOAuth({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:8080/callback',
  scopes: ['daily', 'heartrate', 'personal'],
});

// Generate authorization URL
const { url, state } = oauth.getAuthorizationUrl();

// Exchange authorization code for tokens
const tokens = await oauth.exchangeCode(code);

// Refresh tokens
const newTokens = await oauth.refreshAccessToken(tokens.refreshToken);

// Revoke token
await oauth.revokeAccessToken(tokens.accessToken);
```

### Decoders

The API returns some fields as encoded strings. Use the decoders to convert them:

```typescript
import { decodeSleepPhases, decodeMovement, decodeActivityClass } from 'oura-ts';

// sleep_phase_5_min: "44442332..." -> array of phases
const phases = decodeSleepPhases(sleep.sleep_phase_5_min);
// [{ minute: 0, phase: 'awake' }, { minute: 5, phase: 'awake' }, ...]

// movement_30_sec: "1143222..." -> array of movement levels
const movement = decodeMovement(sleep.movement_30_sec);
// [{ second: 0, level: 'none' }, { second: 30, level: 'none' }, ...]

// class_5_min: "012345..." -> array of activity classes
const activity = decodeActivityClass(dailyActivity.class_5_min);
// [{ minute: 0, activity: 'non_wear' }, { minute: 5, activity: 'rest' }, ...]
```

### Error Handling

```typescript
import { OuraError, AuthenticationError, RateLimitError } from 'oura-ts';

try {
  await client.personalInfo.get();
} catch (error) {
  if (error instanceof AuthenticationError) {
    // 401 - Invalid or expired token
  } else if (error instanceof RateLimitError) {
    // 429 - Rate limit exceeded
    console.log(`Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof OuraError) {
    // Other API errors
    console.log(error.statusCode, error.body);
  }
}
```

## CLI Usage

### Authentication

```bash
# Interactive OAuth login (opens browser)
oura auth login --client-id YOUR_ID --client-secret YOUR_SECRET

# Check token status
oura auth status

# Refresh token
oura auth refresh

# Logout (remove stored token)
oura auth logout
```

### Fetching Data

```bash
# Get personal info
oura get personal-info

# Get data with date range
oura get daily-sleep --start 2025-01-01 --end 2025-01-31

# Get single document by ID
oura get daily-activity abc123

# Get heartrate (uses datetime)
oura get heartrate --start 2025-01-01T00:00:00 --end 2025-01-02T00:00:00

# Decode encoded fields
oura get daily-activity --start 2025-01-01 --decode
```

### Webhooks

```bash
# List webhooks
oura webhooks list --client-id ID --client-secret SECRET

# Create webhook
oura webhooks create --client-id ID --client-secret SECRET \
  --url https://example.com/hook \
  --data-type daily_sleep \
  --event create \
  --verification-token abc123

# Get webhook details
oura webhooks get WEBHOOK_ID --client-id ID --client-secret SECRET

# Renew webhook
oura webhooks renew WEBHOOK_ID --client-id ID --client-secret SECRET

# Delete webhook
oura webhooks delete WEBHOOK_ID --client-id ID --client-secret SECRET
```

### Configuration

**Token Storage**

Tokens are stored at `~/.oura_token` by default. Override with:

```bash
# CLI argument
oura get personal-info --token-file /path/to/token

# Environment variable
export OURA_TOKEN_FILE=/path/to/token
```

**Direct Token**

Skip file storage entirely:

```bash
export OURA_ACCESS_TOKEN=your-token
oura get personal-info
```

**Sandbox Mode**

Use sandbox API endpoints:

```bash
oura get personal-info --sandbox
```

## Development

```bash
# Install dependencies
pnpm install

# Generate types from OpenAPI spec
pnpm generate:types

# Build
pnpm build

# Typecheck
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

### Git Hooks

Husky is configured with:

- **pre-commit**: Runs typecheck, lint, and auto-formats code
- **commit-msg**: Validates conventional commit messages

## License

MIT
