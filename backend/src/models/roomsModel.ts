import { AccountRole, RequestStatus, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import db from '../common/db';
import Model from '../types/Model';

export default {
  getRooms: async () => {
    return { status: 200, data: await db.room.findMany() };
  },
  createRoom: async (friendlyName: string, capacity: number | undefined, roomName: string) => {
    try {
      return {
        status: 200, data: await db.room.create({
          data: {
            friendlyName,
            capacity,
            roomName,
          },
        }),
      };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code == 'P2002') {
        return { status: 400, message: 'Room name already exists.' };
      }
      throw e;
    }
  },
  getRoom: async (roomName: string, user: User) => {
    let room;
    if (user.role == AccountRole.student) {
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: {
            where: { OR: [{ author: { utorid: user.utorid } }, { group: { members: { some: { utorid: user.utorid } } } }] },
            include: { group: true },
          },
          userAccess: { where: { OR: [{ utorid: user.utorid }, { groups: { some: { members: { some: { utorid: user.utorid } } } } }] } },
          approvers: true,
        },
      });
    } else if (user.role == AccountRole.approver) {
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: true,
          approvers: true,
        },
      });
    } else { // admin
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: { include: { group: true } },
          userAccess: true,
          approvers: true,
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
            startDate: { gte: startDate },
            endDate: { lte: endDate },
            status: { notIn: [RequestStatus.denied, RequestStatus.cancelled] },
          },
        },
      },
    });
    if (!room) {
      return { status: 404, message: 'Room not found' };
    }
    return { status: 200, data: room.requests.map(x => ({ status: x.status, bookedRange: [x.startDate, x.endDate] })) };
  },
  grantAccess: async (roomName: string, utorid: string) => {
    try {
      await db.room.update({ where: { roomName }, data: { userAccess: { connect: { utorid } } } });
      await db.request.updateMany({ where: { authorUtorid: utorid, status: RequestStatus.needTCard }, data: { status: RequestStatus.completed } });
      return { status: 200, data: {} };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return { status: 404, message: 'Invalid user or room' };
      }
      throw e;
    }
  },
  revokeAccess: async (roomName: string, utorid: string) => {
    try {
      await db.room.update({ where: { roomName }, data: { userAccess: { disconnect: { utorid } } } });
      await db.request.updateMany({ where: { authorUtorid: utorid, status: RequestStatus.completed, endDate: { gte: new Date() } }, data: { status: RequestStatus.needTCard } });
      return { status: 200, data: {} };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return { status: 404, message: 'Invalid user or room' };
      }
      throw e;
    }
  },
  addApprover: async (roomName: string, utorid: string) => {
    try {
      await db.room.update({ where: { roomName }, data: { approvers: { connect: { utorid } } } });
      return { status: 200, data: {} };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return { status: 404, message: 'Invalid user or room' };
      }
      throw e;
    }
  },
  removeApprover: async (roomName: string, utorid: string) => {
    try {
      await db.room.update({ where: { roomName }, data: { approvers: { disconnect: { utorid } } } });
      return { status: 200, data: {} };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return { status: 404, message: 'Invalid user or room' };
      }
      throw e;
    }
  },
} satisfies Model;
