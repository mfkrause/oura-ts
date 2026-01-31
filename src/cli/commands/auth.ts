import { Command } from 'commander';
import open from 'open';

import { startCallbackServer } from '../../oauth/callback-server.js';
import { type OAuthScope, OuraOAuth } from '../../oauth/oura-oauth.js';
import { calculateExpiresAt, deleteTokens, isTokenExpired, loadTokens, saveTokens } from '../../oauth/token-storage.js';
import type { GlobalOptions } from '../config.js';

interface LoginOptions extends GlobalOptions {
  clientId?: string;
  clientSecret?: string;
  port?: string;
  scopes?: string;
}

export function createAuthCommand(): Command {
  const auth = new Command('auth').description('Authentication commands');

  auth
    .command('login')
    .description('Authenticate with Oura via OAuth')
    .option('--client-id <id>', 'OAuth client ID')
    .option('--client-secret <secret>', 'OAuth client secret')
    .option('--port <port>', 'Local callback server port', '8080')
    .option('--scopes <scopes>', 'Comma-separated scopes', 'daily,personal,heartrate,workout,tag,session,spo2')
    .option('--token-file <path>', 'Token file path')
    .action(async (options: LoginOptions) => {
      const clientId = options.clientId ?? process.env['OURA_CLIENT_ID'];
      const clientSecret = options.clientSecret ?? process.env['OURA_CLIENT_SECRET'];

      if (!clientId || !clientSecret) {
        console.error('Error: Client ID and secret are required.');
        console.error(
          'Provide them via --client-id and --client-secret or OURA_CLIENT_ID and OURA_CLIENT_SECRET environment variables.'
        );
        process.exit(1);
      }

      const port = Number.parseInt(options.port ?? '8080', 10);
      const scopes = (options.scopes ?? 'daily,personal,heartrate,workout,tag,session,spo2')
        .split(',')
        .map((s) => s.trim()) as OAuthScope[];

      const oauth = new OuraOAuth({
        clientId,
        clientSecret,
        redirectUri: `http://localhost:${port}/callback`,
        scopes,
      });

      const { url, state } = oauth.getAuthorizationUrl();

      console.log('Opening browser for authentication...');
      console.log(`If the browser does not open, visit: ${url}`);

      // Start callback server before opening browser
      const callbackPromise = startCallbackServer({
        port,
        expectedState: state,
        timeout: 300_000, // 5 minutes
      });

      await open(url);

      try {
        const { code } = await callbackPromise;
        console.log('Authorization code received. Exchanging for tokens...');

        const tokens = await oauth.exchangeCode(code);

        await saveTokens(
          {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt: calculateExpiresAt(tokens.expires_in),
            clientId,
            clientSecret,
          },
          options.tokenFile
        );

        console.log('Authentication successful! Tokens saved.');
      } catch (error) {
        console.error('Authentication failed:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  auth
    .command('logout')
    .description('Remove stored authentication tokens')
    .option('--token-file <path>', 'Token file path')
    .action(async (options: GlobalOptions) => {
      await deleteTokens(options.tokenFile);
      console.log('Logged out successfully.');
    });

  auth
    .command('status')
    .description('Show current authentication status')
    .option('--token-file <path>', 'Token file path')
    .action(async (options: GlobalOptions) => {
      const tokens = await loadTokens(options.tokenFile);

      if (!tokens) {
        console.log('Not authenticated.');
        return;
      }

      const expired = isTokenExpired(tokens.expiresAt);
      console.log(`Status: ${expired ? 'Expired' : 'Authenticated'}`);
      console.log(`Expires: ${tokens.expiresAt}`);
    });

  auth
    .command('refresh')
    .description('Refresh the access token')
    .option('--token-file <path>', 'Token file path')
    .action(async (options: GlobalOptions) => {
      const tokens = await loadTokens(options.tokenFile);

      if (!tokens) {
        console.error('Not authenticated. Run "oura auth login" first.');
        process.exit(1);
      }

      if (!tokens.clientId || !tokens.clientSecret) {
        console.error('Client credentials not found in token file. Re-authenticate with "oura auth login".');
        process.exit(1);
      }

      const oauth = new OuraOAuth({
        clientId: tokens.clientId,
        clientSecret: tokens.clientSecret,
        redirectUri: 'http://localhost:8080/callback', // Not used for refresh
      });

      try {
        const newTokens = await oauth.refreshAccessToken(tokens.refreshToken);

        await saveTokens(
          {
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
            expiresAt: calculateExpiresAt(newTokens.expires_in),
            clientId: tokens.clientId,
            clientSecret: tokens.clientSecret,
          },
          options.tokenFile
        );

        console.log('Token refreshed successfully.');
      } catch (error) {
        console.error('Token refresh failed:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return auth;
}
