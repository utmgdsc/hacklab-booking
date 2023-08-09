import { AccountRole, RequestStatus, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import db from '../common/db';
import Model from '../types/Model';
import { userSelector } from './utils';
import {
  triggerAdminNotification,
  triggerUserNotification,
} from '../notifications';
import EventTypes from '../types/EventTypes';
import {
  generateBaseRequestNotificationContext as generateBaseNotificationContext,
  generateBaseRequestNotificationContext, generateUserActionContext,
} from '../notifications/generateContext';
import {
  AllContexts, BookingStatusChangeContext,
  RoomAccessContext,
} from '../types/NotificationContext';

const generateApproverContext = (user: User) => ({
  approver_utorid: user.utorid,
  approver_full_name: user.name,
});

const updateRequests = async (roomName: string, authorUtorid:string,  approver:User, status: RequestStatus) => {
  if (!(status === RequestStatus.completed || status === RequestStatus.needTCard)) {
    throw new Error('Invalid status');
  }
  const requests = await db.request.findMany({
    where: {
      roomName,
      authorUtorid: authorUtorid,
      status: RequestStatus.completed ? RequestStatus.needTCard : RequestStatus.completed,
    },
    include: {
      author: true,
      group: true,
      room: true,
    },
  });
  await db.request.updateMany({
    where: {
      authorUtorid: authorUtorid,
      roomName,
      endDate: { gte: new Date() },
      status: RequestStatus.completed ? RequestStatus.needTCard : RequestStatus.completed,
    },
    data: { status: status },
  });
  for (const request of requests) {
    const context = { ...await generateBaseRequestNotificationContext(request), ...generateApproverContext(approver), status: RequestStatus.completed  } satisfies BookingStatusChangeContext;
    await triggerAdminNotification(EventTypes.ADMIN_BOOKING_STATUS_CHANGED, context);
    await triggerUserNotification(EventTypes.BOOKING_STATUS_CHANGED, request.author, context);
  }
};
export default {
  getRooms: async () => {
    return { status: 200, data: await db.room.findMany() };
  },
  createRoom: async (user: User, friendlyName: string, capacity: number | undefined, roomName: string) => {
    try {
      const room = await db.room.create({
        data: {
          friendlyName,
          capacity,
          roomName,
        },
      });
      await triggerAdminNotification(EventTypes.ADMIN_ROOM_CREATED, {
        ...generateUserActionContext(user),
        room: roomName,
        room_friendly: friendlyName,
        capacity,
      });
      return { status: 200, data: room };
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
            where: {
              OR: [
                { author: { utorid: user.utorid } },
                { group: { members: { some: { utorid: user.utorid } } } },
              ],
            },
            include: { group: true },
          },
          userAccess: {
            where: {
              OR: [
                { utorid: user.utorid },
                { groups: { some: { members: { some: { utorid: user.utorid } } } } },
              ],
            },
            select: userSelector(),
          },
        },
      });
    } else if (user.role == AccountRole.approver) {
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: true,
          approvers: { select: userSelector() },
        },
      });
    } else { // admin
      room = await db.room.findUnique({
        where: { roomName },
        include: {
          requests: { include: { group: true } },
          userAccess: { select: userSelector() },
          approvers: { select: userSelector() },
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
    return {
      status: 200,
      data: room.requests.map((x) => ({
        status: x.status,
        bookedRange: [x.startDate, x.endDate],
      })),
    };
  },
  grantAccess: async (user: User, roomName: string, utorid: string) => {
    try {
      const room = await db.room.update({
        where: { roomName },
        data: { userAccess: { connect: { utorid } } },
        include: { userAccess: { where: { utorid } } },
      });
      const context : AllContexts = {
        ...generateUserActionContext(room.userAccess[0]), ...generateApproverContext(user),
        room: room.roomName,
        room_friendly: room.friendlyName,
      } satisfies RoomAccessContext;
      await triggerAdminNotification(EventTypes.ADMIN_ROOM_ACCESS_GRANTED, context);
      await triggerUserNotification(EventTypes.ROOM_ACCESS_GRANTED, utorid, context);
      await updateRequests(roomName, utorid, user,  RequestStatus.completed);

      return { status: 200, data: {} };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return { status: 404, message: 'Invalid user or room' };
      }
      throw e;
    }
  },
  revokeAccess: async (user:User, roomName: string, utorid: string) => {
    try {
      const room = await db.room.update({
        where: { roomName },
        data: { userAccess: { disconnect: { utorid } } },
        include: { userAccess: { where: { utorid } } },
      });
      const context : AllContexts = {
        ...generateUserActionContext(room.userAccess[0]), ...generateApproverContext(user),
        room: room.roomName,
        room_friendly: room.friendlyName,
      } satisfies RoomAccessContext;
      await triggerAdminNotification(EventTypes.ADMIN_ROOM_ACCESS_REVOKED, context);
      await triggerUserNotification(EventTypes.ROOM_ACCESS_REVOKED, utorid, context);
      await updateRequests(roomName, utorid, user,  RequestStatus.needTCard);

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
      await db.room.update({
        where: { roomName },
        data: { approvers: { connect: { utorid } } },
      });
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
      await db.room.update({
        where: { roomName },
        data:  { approvers: { disconnect: { utorid } } },
      });
      return { status: 200, data: {} };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return { status: 404, message: 'Invalid user or room' };
      }
      throw e;
    }
  },
} satisfies Model;
