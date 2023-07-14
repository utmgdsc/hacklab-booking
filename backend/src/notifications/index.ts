import email from './email';
import templates from './templates';
import { sendWebhook } from './webhooks';
import { AccountRole, User } from '@prisma/client';
import db from '../common/db';
import EventTypes from '../types/EventTypes';
import { UserWebhooks, WebhookTypes } from '../types/webhooksTypes';
import logger from '../common/logger';
import { AllContexts, NotificationFullContext } from '../types/NotificationContext';

const applyContext = (text: string, context: object) => {
  const keys = Object.keys(context);
  const values = Object.values(context);
  const regex = new RegExp(`{{(${keys.join('|')})}}`, 'g');
  return text.replace(regex, (match, p1) => values[keys.indexOf(p1)]);
};

export const triggerNotification = async (
  notification: EventTypes,
  destination: {
    destination: string;
    type: 'email' | 'discord' | 'slack';
  },
  context: NotificationFullContext,
) => {
  const template = templates[notification];
  if (!template) {
    logger.warn(`No template found for ${notification}`);
  }
  let body: string;
  switch (destination.type) {
    case 'email':
      let subject = 'New Notification from Hacklab Booking System';
      body = applyContext(template.template, context);
      if (template.email) {
        if (typeof template.email === 'string') {
          body = applyContext(template.email, context);
        } else {
          subject = applyContext(template.email.subject, context);
          body = applyContext(template.email.html, context);
        }
      }
      await email(destination.destination, subject, body);
      break;
    case 'slack':
    case 'discord':
      if (template.discord && destination.type === 'discord') {
        body = applyContext(template.discord, context);
      } else if (template.slack && destination.type === 'slack') {
        body = applyContext(template.slack, context);
      } else {
        body = applyContext(template.template, context);
      }
      await sendWebhook(destination.destination, body);
      break;
  }
};

export const triggerUserNotification = async (notification: EventTypes, user: string | User, context: AllContexts) => {
  const userFetched = typeof user === 'string' ? await db.user.findUnique({ where: { utorid: user } }) : user;
  if (!userFetched) {
    return;
  }
  const webhooks = userFetched.webhooks as UserWebhooks;
  if (!webhooks) {
    return;
  }
  const webhooksToTrigger = webhooks[notification];
  if (!webhooksToTrigger) {
    return;
  }
  for (const webhook of webhooksToTrigger) {
    let destination: string | undefined;
    switch (webhook) {
      case WebhookTypes.email:
        destination = userFetched.email;
        break;
      case WebhookTypes.discord:
        destination = userFetched.discordWebhook ?? undefined;
        break;
      case WebhookTypes.slack:
        destination = userFetched.slackWebhook ?? undefined;
        break;
      default:
        continue;
    }
    if (!destination) {
      continue;
    }
    await triggerNotification(
      notification,
      {
        destination: destination,
        type: webhook,
      },
      {
        ...context,
        receiver_email: userFetched.email,
        receiver_utorid: userFetched.utorid,
        receiver_full_name: userFetched.name,
        frontend_url: process.env.FRONTEND_URL ?? 'http://localhost:3555',
      },
    );
  }
};
export const triggerMassNotification = async (
  notification: EventTypes,
  users: User[] | string[],
  context: AllContexts,
) => {
  if (users.length === 0) {
    return;
  }
  if (typeof users[0] === 'string') {
    users = await db.user.findMany({
      where: {
        utorid: { in: users as string[] },
      },
    });
  }

  for (const user of users as User[]) {
    await triggerUserNotification(notification, user, context);
  }
};
export const triggerStaffNotification = async (notification: EventTypes, context: AllContexts) => {
  const staff = await db.user.findMany({
    where: {
      role: { in: [AccountRole.approver, AccountRole.admin] },
    },
  });
  await triggerMassNotification(notification, staff, context);
};
