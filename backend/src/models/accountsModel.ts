import { AccountRole, Theme, User } from '@prisma/client';
import db from '../common/db';
import Model from '../types/Model';
import { UserWebhooks, WebhookTypes } from '../types/webhooksTypes';
import EventTypes from '../types/EventTypes';
import { userSelector } from './utils';
import { isUTORid, isUofTEmail } from 'is-utorid';

const verifyWebhook = (webhook: unknown) => {
  if (webhook === null) {
    return true;
  }
  if (typeof webhook !== 'string') {
    return false;
  }
  try {
    new URL(webhook as string);
  } catch (e) {
    return false;
  }
  return true;
};
export default {
  updateWebhooks: async (user: User, webhooks: unknown) => {
    if (typeof webhooks !== 'object') {
      return { status: 400, message: 'Invalid webhooks object.' };
    }
    if (webhooks === null) {
      return { status: 400, message: 'Invalid webhooks object.' };
    }
    for (const key in webhooks) {
      if (!Object.keys(EventTypes).includes(key)) {
        return { status: 400, message: `Invalid event type: ${key}` };
      }
      if (!webhooks.hasOwnProperty(key) || !Array.isArray((webhooks as Record<string, unknown>)[key])) {
        return { status: 400, message: 'Invalid webhook array.' };
      }
      for (const webhook of (webhooks as Record<string, unknown[]>)[key]) {
        if (!(Object.values(WebhookTypes) as string[]).includes(webhook as string)) {
          return { status: 400, message: 'Invalid webhook.' };
        }
      }
    }
    await db.user.update({
      where: { utorid: user.utorid },
      data: { webhooks: webhooks as UserWebhooks },
    });
    return { status: 200, data: {} };
  },
  updateDiscordWebhook: async (user: User, webhook: unknown) => {
    if (!verifyWebhook(webhook)) {
      return { status: 400, message: 'Invalid webhook.' };
    }
    await db.user.update({
      where: { utorid: user.utorid },
      data: { discordWebhook: webhook as string },
    });
    return { status: 200, data: {} };
  },
  updateSlackWebhook: async (user: User, webhook: unknown) => {
    if (!verifyWebhook(webhook)) {
      return { status: 400, message: 'Invalid webhook.' };
    }
    await db.user.update({
      where: { utorid: user.utorid },
      data: { slackWebhook: webhook as string },
    });
    return { status: 200, data: {} };
  },
  upsertUser: async (user: Omit<User, 'theme' | 'role'> & { role?: string; theme?: Theme }) => {
    if (!user.name.trim()) {
      return { status: 400, message: 'Missing required fields.' };
    }
    if (!isUofTEmail(user.email)) {
      return { status: 400, message: 'Invalid email.' };
    }
    if (!isUTORid(user.utorid)) {
      return { status: 400, message: 'Invalid utorid.' };
    }

    user.role = Object.keys(AccountRole).includes(<string>user.role) ? user.role : AccountRole.student;
    const query = {
      where: { utorid: user.utorid },
      update: { email: user.email, name: user.name },
      include: {
        groups: {
          include: {
            members: true,
          },
        },
      },
      create: <User & { webhooks: object }>user,
    };
    try {
      return {
        status: 200,
        data: <User>await db.user.upsert(query),
      };
    } catch (e) {
      return {
        status: 200,
        data: <User>await db.user.upsert(query),
      };
    }
  },
  getUser: async (utorid: string, user: User) => {
    const moreInfo = user.role === AccountRole.admin || user.utorid === utorid;
    const groupsFetching = moreInfo
      ? {
          include: {
            members: true,
          },
        }
      : false;
    const userFetched = await db.user.findUnique({
      where: { utorid: utorid },
      include: {
        groups: groupsFetching,
        invited: groupsFetching,
        manager: groupsFetching,
        requests: moreInfo,
        roomAccess: moreInfo,
      },
    });
    if (!userFetched) {
      return { status: 404, message: 'User not found.' };
    }
    return { status: 200, data: userFetched };
  },
  changeTheme: async (user: User | string, theme: string) => {
    if (!Object.keys(Theme).includes(theme)) {
      return { status: 400, message: 'Invalid theme.' };
    }
    await db.user.update({
      where: { utorid: typeof user === 'string' ? user : user.utorid },
      data: { theme: theme as Theme },
    });
    return { status: 200, data: {} };
  },
  changeRole: async (user: User | string, role: string) => {
    const utorid = typeof user === 'string' ? user : user.utorid;
    const userFetched = await db.user.findUnique({ where: { utorid: utorid } });
    if (!userFetched) {
      return { status: 404, message: 'User not found.' };
    }
    if (!Object.keys(AccountRole).includes(role)) {
      return { status: 400, message: 'Invalid role.' };
    }
    await db.user.update({
      where: { utorid: typeof user === 'string' ? user : user.utorid },
      data: { role: role as AccountRole },
    });
    return { status: 200, data: {} };
  },
  acceptGroupInvite: async (user: User | string, groupId: string) => {
    const utorid = typeof user === 'string' ? user : user.utorid;
    const userFetched = await db.user.findUnique({
      where: { utorid: utorid },
      include: {
        invited: { where: { id: groupId }, select: { id: true } },
        groups: { where: { id: groupId }, select: { id: true } },
      },
    });
    if (!userFetched) {
      return { status: 404, message: 'User not found.' };
    }
    if (!userFetched.invited.find((invite) => invite.id === groupId)) {
      return {
        status: 400,
        message: 'User has not been invited to this group.',
      };
    }
    if (userFetched.groups.find((group) => group.id === groupId)) {
      return { status: 400, message: 'User is already in this group.' };
    }
    db.user.update({
      where: { utorid: utorid },
      data: { groups: { connect: { id: groupId } } },
    });
    return { status: 200, data: {} };
  },
  getApprovers: async () => {
    return {
      status: 200,
      data: await db.user.findMany({
        where: { role: { in: [AccountRole.approver, AccountRole.admin] } },
        select: userSelector(),
      }),
    };
  },
} satisfies Model;
