import { AccountRole, Theme, User } from '@prisma/client';
import db from '../common/db';
import Model from '../types/Model';
import ModelResponse from '../types/ModelResponse';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export default {
  upsertUser: async (user: Omit<Omit<User, 'role'>, 'theme'> & { role?: string, theme?:Theme }) => {
    if (user.name.trim()) {
      return { status: 400, message: 'Missing required fields.' };
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
      return { status: 400, message: 'Invalid email.' };
    }
    if (!/^[a-z|0-9]{8}$/.test(user.utorid)) {
      return { status: 400, message: 'Invalid utorid.' };
    }

    user.role = Object.keys(AccountRole).includes(<string>user.role) ? user.role : AccountRole.student;
    try {
      return {
        status: 200,
        data: <User>(await db.user.upsert({ where: { utorid: user.utorid }, update:{ email:user.email }, create: <User>user })),
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return { status: 409, message: 'User already exists.' };
        }
      }
      return { status: 500, message: 'Internal error.' };
    }
  },
} satisfies Model;

