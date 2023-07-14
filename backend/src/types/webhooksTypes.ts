export enum WebhookTypes {
  discord = 'discord',
  slack = 'slack',
  email = 'email',
}
export type UserWebhooks = { [key: string]: WebhookTypes[] };
