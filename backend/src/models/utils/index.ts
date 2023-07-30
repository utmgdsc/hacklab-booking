import { User } from '@prisma/client';

export const userSelector = (): Record<keyof User, boolean> => ({
  utorid: true,
  name: true,
  email: true,
  role: true,
  theme: false,
  webhooks: false,
  discordWebhook: false,
  slackWebhook: false,
});