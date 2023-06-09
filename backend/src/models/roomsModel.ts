import Model from '../types/Model';
import db from '../common/db';
import { AccountRole, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export default {
  getRoom: async (roomName: string, user: User) => {
    let room;
    if (user.role == AccountRole.student) {
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: {
            where: { OR: [{ author: { utorid: user.utorid } }, { group: { members: { some: { utorid: user.utorid } } } }] },
          },
          userAccess: { where: { OR: [{ utorid: user.utorid }, { groups: { some: { members: { some: { utorid: user.utorid } } } } }] } },
        },
      });
    } else if (user.role == AccountRole.approver) {
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: true,
        },
      });
    } else {
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: true,
          userAccess: true,
        },
      });
    }
    if (!room) {
      return { status: 404, message: 'Room not found' };
    }
    return { status: 200, data: room };
  },
  getBlockedDates: async (roomName: string, startDate: Date, endDate: Date) => {
    const room = await db.room.findUnique({
      where: { roomName },
      include: {
        requests: {
          where: {
            startDate: { lte: startDate },
            endDate: { gte: endDate },
          },
        },
      },
    });
    if (!room) {
      return { status: 404, message: 'Room not found' };
    }
    return { status: 200, data: room.requests.map(x=>[x.startDate, x.endDate]) };
  },
  grantAccess: async (roomName: string, utorid: string) => {
    try {
      await db.room.update({ where: { roomName }, data:{ userAccess: { connect: { utorid } } } });
      return { status: 200, message: 'Access granted' };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2003') {
        return { status: 404, message: 'Invalid user or room' };
      }
      if ((e as PrismaClientKnownRequestError).code === 'P2002') {
        return { status: 400, message: 'User already has access' };
      }
      throw e;
    }
  },
} satisfies Model;
