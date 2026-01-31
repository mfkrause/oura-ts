import { type Server, createServer } from 'node:http';
import { URL } from 'node:url';

export interface CallbackResult {
  code: string;
  state: string;
}

export interface CallbackServerOptions {
  port?: number;
  expectedState: string;
  timeout?: number;
}

const SUCCESS_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Successful</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
    .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #22c55e; margin-bottom: 0.5rem; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Authorization Successful</h1>
    <p>You can close this window and return to the terminal.</p>
  </div>
</body>
</html>
`;

const ERROR_HTML = (message: string) => `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Failed</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
    .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #ef4444; margin-bottom: 0.5rem; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Authorization Failed</h1>
    <p>${message}</p>
  </div>
</body>
</html>
`;

export function startCallbackServer(options: CallbackServerOptions): Promise<CallbackResult> {
  const port = options.port ?? 8080;
  const timeout = options.timeout ?? 300_000; // 5 minutes

  return new Promise((resolve, reject) => {
    const state: { timeoutId?: NodeJS.Timeout; server?: Server } = {};

    const cleanup = () => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      if (state.server) {
        state.server.close();
      }
    };

    state.server = createServer((request, response) => {
      if (!request.url) {
        return;
      }

      const url = new URL(request.url, `http://localhost:${port}`);

      if (url.pathname !== '/callback') {
        response.writeHead(404);
        response.end('Not found');
        return;
      }

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        response.writeHead(400, { 'Content-Type': 'text/html' });
        response.end(ERROR_HTML(`Authorization denied: ${error}`));
        cleanup();
        reject(new Error(`Authorization denied: ${error}`));
        return;
      }

      if (!code || !state) {
        response.writeHead(400, { 'Content-Type': 'text/html' });
        response.end(ERROR_HTML('Missing code or state parameter'));
        cleanup();
        reject(new Error('Missing code or state parameter'));
        return;
      }

      if (state !== options.expectedState) {
        response.writeHead(400, { 'Content-Type': 'text/html' });
        response.end(ERROR_HTML('Invalid state parameter'));
        cleanup();
        reject(new Error('Invalid state parameter (possible CSRF attack)'));
        return;
      }

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(SUCCESS_HTML);
      cleanup();
      resolve({ code, state });
    });

    state.timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Authorization timeout'));
    }, timeout);

    state.server.listen(port);

    state.server.on('error', (error) => {
      cleanup();
      reject(error);
    });
  });
}
