import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { handlers } from './mocks/handlers.js';

export const server = setupServer(...handlers);

// Use 'bypass' to allow real requests for integration tests
// Mocked endpoints will still be intercepted
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
