import { Command } from 'commander';

import { WebhooksResource } from '../../resources/webhooks.js';
import type { WebhookDataType, WebhookOperation } from '../../types.js';

interface WebhookOptions {
  clientId?: string;
  clientSecret?: string;
}

interface CreateOptions extends WebhookOptions {
  url: string;
  dataType: string;
  event: string;
  verificationToken: string;
}

interface UpdateOptions extends WebhookOptions {
  url?: string;
  dataType?: string;
  event?: string;
  verificationToken: string;
}

function getClientCredentials(options: WebhookOptions): { clientId: string; clientSecret: string } {
  const clientId = options.clientId ?? process.env['OURA_CLIENT_ID'];
  const clientSecret = options.clientSecret ?? process.env['OURA_CLIENT_SECRET'];

  if (!clientId || !clientSecret) {
    console.error('Error: Client ID and secret are required for webhook operations.');
    console.error(
      'Provide them via --client-id and --client-secret or OURA_CLIENT_ID and OURA_CLIENT_SECRET environment variables.'
    );
    process.exit(1);
  }

  return { clientId, clientSecret };
}

export function createWebhooksCommand(): Command {
  const webhooks = new Command('webhooks').description('Manage webhook subscriptions');

  webhooks
    .command('list')
    .description('List all webhook subscriptions')
    .option('--client-id <id>', 'OAuth client ID')
    .option('--client-secret <secret>', 'OAuth client secret')
    .action(async (options: WebhookOptions) => {
      const credentials = getClientCredentials(options);
      const resource = new WebhooksResource(credentials);

      try {
        const subscriptions = await resource.list();
        console.log(JSON.stringify(subscriptions, null, 2));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  webhooks
    .command('get <id>')
    .description('Get a webhook subscription by ID')
    .option('--client-id <id>', 'OAuth client ID')
    .option('--client-secret <secret>', 'OAuth client secret')
    .action(async (id: string, options: WebhookOptions) => {
      const credentials = getClientCredentials(options);
      const resource = new WebhooksResource(credentials);

      try {
        const subscription = await resource.get(id);
        console.log(JSON.stringify(subscription, null, 2));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  webhooks
    .command('create')
    .description('Create a new webhook subscription')
    .requiredOption('--url <url>', 'Callback URL')
    .requiredOption('--data-type <type>', 'Data type (e.g., daily_sleep, daily_activity)')
    .requiredOption('--event <type>', 'Event type (create, update, delete)')
    .requiredOption('--verification-token <token>', 'Verification token')
    .option('--client-id <id>', 'OAuth client ID')
    .option('--client-secret <secret>', 'OAuth client secret')
    .action(async (options: CreateOptions) => {
      const credentials = getClientCredentials(options);
      const resource = new WebhooksResource(credentials);

      try {
        const subscription = await resource.create({
          callbackUrl: options.url,
          dataType: options.dataType as WebhookDataType,
          eventType: options.event as WebhookOperation,
          verificationToken: options.verificationToken,
        });
        console.log(JSON.stringify(subscription, null, 2));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  webhooks
    .command('update <id>')
    .description('Update a webhook subscription')
    .requiredOption('--verification-token <token>', 'Verification token (required)')
    .option('--url <url>', 'New callback URL')
    .option('--data-type <type>', 'New data type')
    .option('--event <type>', 'New event type')
    .option('--client-id <id>', 'OAuth client ID')
    .option('--client-secret <secret>', 'OAuth client secret')
    .action(async (id: string, options: UpdateOptions) => {
      const credentials = getClientCredentials(options);
      const resource = new WebhooksResource(credentials);

      try {
        const subscription = await resource.update(id, {
          verificationToken: options.verificationToken,
          callbackUrl: options.url,
          dataType: options.dataType as WebhookDataType | undefined,
          eventType: options.event as WebhookOperation | undefined,
        });
        console.log(JSON.stringify(subscription, null, 2));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  webhooks
    .command('delete <id>')
    .description('Delete a webhook subscription')
    .option('--client-id <id>', 'OAuth client ID')
    .option('--client-secret <secret>', 'OAuth client secret')
    .action(async (id: string, options: WebhookOptions) => {
      const credentials = getClientCredentials(options);
      const resource = new WebhooksResource(credentials);

      try {
        await resource.delete(id);
        console.log('Webhook deleted successfully.');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  webhooks
    .command('renew <id>')
    .description('Renew a webhook subscription')
    .option('--client-id <id>', 'OAuth client ID')
    .option('--client-secret <secret>', 'OAuth client secret')
    .action(async (id: string, options: WebhookOptions) => {
      const credentials = getClientCredentials(options);
      const resource = new WebhooksResource(credentials);

      try {
        const subscription = await resource.renew(id);
        console.log(JSON.stringify(subscription, null, 2));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return webhooks;
}
