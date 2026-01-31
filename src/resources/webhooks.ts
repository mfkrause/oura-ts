import type { KyInstance } from 'ky';

import { type WebhookClientOptions, createWebhookClient, del, get, post, put } from '../client/http.js';
import type {
  CreateWebhookSubscriptionRequest,
  UpdateWebhookSubscriptionRequest,
  WebhookDataType,
  WebhookOperation,
  WebhookSubscription,
} from '../types.js';

interface WebhookListResponse {
  data: WebhookSubscription[];
}

export interface CreateWebhookOptions {
  callbackUrl: string;
  verificationToken: string;
  eventType: WebhookOperation;
  dataType: WebhookDataType;
}

export interface UpdateWebhookOptions {
  verificationToken: string;
  callbackUrl?: string;
  eventType?: WebhookOperation;
  dataType?: WebhookDataType;
}

export class WebhooksResource {
  private readonly client: KyInstance;

  constructor(options: WebhookClientOptions) {
    this.client = createWebhookClient(options);
  }

  async list(): Promise<WebhookSubscription[]> {
    const response = await get<WebhookListResponse>(this.client, 'webhook/subscription');
    return response.data;
  }

  async get(id: string): Promise<WebhookSubscription> {
    return get<WebhookSubscription>(this.client, `webhook/subscription/${id}`);
  }

  async create(options: CreateWebhookOptions): Promise<WebhookSubscription> {
    const body: CreateWebhookSubscriptionRequest = {
      callback_url: options.callbackUrl,
      verification_token: options.verificationToken,
      event_type: options.eventType,
      data_type: options.dataType,
    };
    return post<WebhookSubscription>(this.client, 'webhook/subscription', body);
  }

  async update(id: string, options: UpdateWebhookOptions): Promise<WebhookSubscription> {
    const body: UpdateWebhookSubscriptionRequest = {
      verification_token: options.verificationToken,
    };

    if (options.callbackUrl !== undefined) {
      body.callback_url = options.callbackUrl;
    }
    if (options.eventType !== undefined) {
      body.event_type = options.eventType;
    }
    if (options.dataType !== undefined) {
      body.data_type = options.dataType;
    }

    return put<WebhookSubscription>(this.client, `webhook/subscription/${id}`, body);
  }

  async delete(id: string): Promise<void> {
    await del(this.client, `webhook/subscription/${id}`);
  }

  async renew(id: string): Promise<WebhookSubscription> {
    return put<WebhookSubscription>(this.client, `webhook/subscription/renew/${id}`);
  }
}
