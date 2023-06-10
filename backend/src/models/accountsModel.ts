import { AccountRole, Theme, User } from '@prisma/client';
import db from '../common/db';
import Model from '../types/Model';
import ModelResponse from '../types/ModelResponse';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export default {
  upsertUser: async (user: Omit<Omit<User, 'role'>, 'theme'> & { role?: string, theme?:Theme }) => {
    if (!user.name.trim()) {
      return { status: 400, message: 'Missing required fields.' };
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
      return { status: 400, message: 'Invalid email.' };
    }
    if (!/^[a-z|0-9]{8}$/.test(user.utorid)) {
      return { status: 400, message: 'Invalid utorid.' };
    }

    user.role = Object.keys(AccountRole).includes(<string>user.role) ? user.role : AccountRole.student;
    return {
      status: 200,
      data: <User>(await db.user.upsert({ where: { utorid: user.utorid }, update:{ email:user.email }, create: <User>user })),
    };
  },
  getUser: async (utorid: string) => {
    const user = await db.user.findUnique({ where: { utorid: utorid } });
    if (!user) {
      return { status: 404, message: 'User not found.' };
    }
    return { status: 200, data: user };
  },
  changeTheme: async (user: User | string, theme: string) => {
    if (!Object.keys(Theme).includes(theme)) {
      return { status: 400, message: 'Invalid theme.' };
    }
    await db.user.update({ where: { utorid: typeof user === 'string' ? user : user.utorid }, data: { theme: theme as Theme } });
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
    await db.user.update({ where: { utorid: typeof user === 'string' ? user : user.utorid }, data: { role: role as AccountRole } });
    return { status: 200, data: {} };
  },
  acceptGroupInvite: async (user: User | string, groupId: number) => {
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
} satisfies Model;

