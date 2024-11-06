import { AccountRole, RequestStatus, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import db from '../common/db';
import logger from '../common/logger';
import { CreateRequest } from '../types/CreateRequest';
import Model from '../types/Model';
import { ModelResponseError } from '../types/ModelResponse';
import { triggerAdminNotification, triggerMassNotification, triggerTCardNotification } from '../notifications';
import EventTypes from '../types/EventTypes';
import { userSelector } from './utils';
import {
  generateBaseRequestNotificationContext as generateBaseNotificationContext,
  generateUserActionContext,
} from '../notifications/generateContext';

const requestCounter = () => {
  return {
    select: {
      requests: {
        where: {
          status: { not: { in: [RequestStatus.denied, RequestStatus.cancelled] } },
          endDate: { gte: new Date() },
        },
      },
    },
  };
};
const validateRequest = async (request: CreateRequest): Promise<ModelResponseError | undefined> => {
  if (request.title.trim() === '' || request.description.trim() === '') {
    return { status: 400, message: 'Missing required fields.' };
  }

  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return {
      status: 400,
      message: 'Invalid date format.',
    };
  }
  if (startDate > endDate) {
    return {
      status: 400,
      message: 'Start date cannot be after end date.',
    };
  }
  if (startDate < new Date()) {
    return {
      status: 400,
      message: 'Start date cannot be before today.',
    };
  }

  if (
    await db.request.findFirst({
      where: {
        OR: [
          { startDate: { lte: startDate }, endDate: { gte: endDate } },
          {
            startDate: { gte: startDate, lte: endDate },
          },
          {
            endDate: { gte: startDate, lte: endDate },
          },
        ],
        roomName: request.roomName,
        status: { notIn: [RequestStatus.denied, RequestStatus.cancelled, RequestStatus.pending] },
      },
    })
  ) {
    return {
      status: 400,
      message: 'Room is not available for the requested time period.',
    };
  }
};

const approveRequest = async (id: string, approver: User, reason?: string) => {
  const request = await db.request.findUnique({
    where: { id },
    include: {
      room: {
        include: {
          userAccess: { select: { utorid: true } },
          approvers: { select: { utorid: true } },
        },
      },
      author: { select: { utorid: true } },
    },
  });
  if (!request) {
    return { status: 404, message: 'Request ID not found.' };
  }
  if (!request.room.approvers.some((user: { utorid: string }) => user.utorid === approver.utorid)) {
    return { status: 403, message: 'You cannot approve requests for this room.' };
  }
  if (request.status !== RequestStatus.pending) {
    return { status: 400, message: 'Request is not pending.' };
  }
  let status: RequestStatus = RequestStatus.needTCard;
  if (request.room.userAccess.some((user: { utorid: string }) => user.utorid === request.author.utorid)) {
    status = RequestStatus.completed;
  }
  const requestFetched = await db.request.update({
    where: { id: request.id },
    data: {
      reason,
      status: status,
    },
    include: {
      group: true,
      room: true,
      author: true,
    },
  });
  const { startDate, endDate, roomName } = request;
  await db.request.updateMany({
    where: {
      OR: [
        { startDate: { lte: startDate }, endDate: { gte: endDate } },
        {
          startDate: { gte: startDate, lte: endDate },
        },
        {
          endDate: { gte: startDate, lte: endDate },
        },
      ],
      roomName: roomName,
      status: RequestStatus.pending,
    },
    data: {
      status: RequestStatus.denied,
    },
  });
  const context = {
    ...(await generateBaseNotificationContext(requestFetched)),
    changer_utorid: approver.utorid,
    changer_full_name: approver.name,
    status,
    reason,
  };
  await triggerMassNotification(EventTypes.BOOKING_STATUS_CHANGED, [requestFetched.author], context);
  await triggerAdminNotification(EventTypes.ADMIN_BOOKING_STATUS_CHANGED, context);
  if (status !== RequestStatus.completed) {
    await triggerTCardNotification(EventTypes.ROOM_ACCESS_REQUESTED, {
      ...generateUserActionContext(requestFetched.author),
      room: requestFetched.room.roomName,
      room_friendly: requestFetched.room.friendlyName,
    });
  }
  return { status: 200, data: {} };
};

export default {
  getRequests: async (filters: { [key: string]: string }, user: User) => {
    const query: { [key: string]: unknown } = {};
    logger.debug(filters.start_date);
    filters.start_date = filters.start_date || new Date().toISOString();
    if (filters.start_date) {
      query.startDate = { gte: new Date(filters.start_date) };
    }
    logger.debug(query.startDate);
    // In a week
    if (filters.end_date) {
      query.endDate = { lte: filters.end_date };
    } else {
      filters.end_date = filters.end_date || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      query.endDate = { lte: filters.end_date };
    }
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      if (startDate > endDate) {
        return {
          status: 400,
          message: 'Start date cannot be after end date.',
        };
      }
    }
    if (filters.group) {
      query.groupId = parseInt(filters.group);
      if (
        user.role === AccountRole.student &&
        !(await db.user.findFirst({
          where: {
            utorid: user.utorid,
            groups: { some: { id: query.groupId as string } },
          },
        }))
      ) {
        return {
          status: 403,
          message: 'User does not have access to this group.',
        };
      }
    } else if (user.role === AccountRole.student) {
      query.group = { members: { some: { utorid: user.utorid } } };
    }
    if (filters.room) {
      query.roomName = filters.room;
    }
    if (filters.status && !Object.keys(RequestStatus).includes(filters.status)) {
      return { status: 400, message: 'Invalid status.' };
    }
    if (filters.status) {
      query.status = filters.status;
    } else if (user.role === AccountRole.tcard) {
      query.status = RequestStatus.needTCard;
    } else if (user.role === AccountRole.approver) {
      query.status = RequestStatus.pending;
    }

    if (user.role === AccountRole.approver) {
      query.OR = [{ approvers: { some: { utorid: user.utorid } } }, { approvers: { none: {} } }];
    }
    logger.debug(JSON.stringify(query));
    return {
      status: 200,
      data: await db.request.findMany({
        where: query,
        include: {
          group: {
            include: {
              _count: requestCounter(),
            },
          },
          room: true,
          author: {
            select: {
              roomAccess: true,
              ...userSelector(),
              _count: requestCounter(),
            },
          },
          approvers: { select: userSelector() },
        },
      }),
    };
  },
  createRequest: async (request: CreateRequest, user: User) => {
    const error = await validateRequest(request);
    if (error) {
      return error;
    }
    const newRequest = {
      ...request,
      authorUtorid: user.utorid,
    };
    newRequest.approvers = newRequest.approvers || [];
    const userFetched = await db.user.findUnique({
      where: { utorid: newRequest.authorUtorid },
      include: { 
        groups: { select: { id: true } },
        requests: {
          where: { status: RequestStatus.pending }
        } 
      },
    });
    if (!userFetched) {
      return { status: 404, message: 'User not found.' };
    }
    if (!userFetched.groups.some((group) => group.id === request.groupId)) {
      return {
        status: 403,
        message: 'User does not have access to this group.',
      };
    }
    request.approvers = request.approvers ?? [];

    const groupFetched = await db.group.findUnique({
      where: { id: request.groupId },
      include: { 
        requests: {
          where: { status: RequestStatus.pending }
        }
      }
    })
    if (!groupFetched) {
      return { status: 404, message: 'Group not found.'};
    }

    const room = await db.room.findUnique({ where : { roomName : request.roomName } })
    if (!room) {
      return { status: 404, message: 'Room not found.'};
    }
    if (userFetched.requests.length > room.requestLimit) {
      return {
        status: 429,
        message: 'User has too many pending requests.',
      }
    }

    if (groupFetched.requests.length > room.requestLimit) {
      return {
        status: 429,
        message: 'Group has too many pending requests.',
      }
    }

    try {
      const madeRequest = await db.request.create({
        data: {
          approvers: { connect: request.approvers.map((utorid) => ({ utorid })) },
          status: RequestStatus.pending,
          author: { connect: { utorid: user.utorid } },
          group: { connect: { id: request.groupId } },
          room: { connect: { roomName: request.roomName } },
          startDate: new Date(request.startDate),
          endDate: new Date(request.endDate),
          title: request.title,
          description: request.description,
        },
        include: {
          group: true,
          room: true,
          author: { select: { ...userSelector() } },
          approvers: true,
        },
      });
      const context = await generateBaseNotificationContext(madeRequest);
      if (userFetched.roomApprover.map((x) => x.roomName).includes(request.roomName)) {
        await approveRequest(madeRequest.id, user, 'Request automatically accepted by approver');
      } else {
        await triggerMassNotification(EventTypes.BOOKING_APPROVAL_REQUESTED, request.approvers, context);
      }
      await triggerAdminNotification(EventTypes.ADMIN_BOOKING_CREATED, context);
      // Delete approver data from response
      const tempRequest: WithOptional<typeof madeRequest, 'approvers'> = madeRequest;
      delete tempRequest.approvers;
      return {
        status: 200,
        data: tempRequest as Omit<typeof madeRequest, 'approvers'>,
      };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return {
          status: 400,
          message: 'Invalid id for group, room or utorid.',
        };
      }
      throw e;
    }
  },
  getRequest: async (id: string, user: User) => {
    const request = await db.request.findUnique({
      where: { id },
      include: {
        group: { include: { members: { select: userSelector() }, _count: { select: { requests: true } } } },
        room: true,
        author: { include: { roomAccess: true, _count: { select: { requests: true } } } },
        approvers: { select: userSelector() },
      },
    });
    if (!request) {
      return { status: 404, message: 'Request ID not found.' };
    }
    if (user.role === AccountRole.student && !request.group.members.map((x) => x.utorid).includes(user.utorid)) {
      return {
        status: 403,
        message: 'User does not have permission to view this request.',
      };
    }
    return { status: 200, data: request };
  },
  setRequestStatus: async (id: string, user: User, status: RequestStatus, reason?: string) => {
    if (!Object.keys(RequestStatus).includes(status)) {
      return { status: 400, message: 'Invalid status.' };
    }
    const request = await db.request.findUnique({
      where: { id },
      include: {
        group: { include: { managers: { select: { utorid: true } } } },
        author: { select: { utorid: true } },
        room: { include: { approvers: { select: { utorid: true } } } },
      },
    });
    if (!request) {
      return { status: 404, message: 'Invalid request ID.' };
    }
    if (
      status === RequestStatus.cancelled &&
      request.author.utorid !== user.utorid &&
      !request.group.managers.some((manager) => manager.utorid === user.utorid)
    ) {
      return {
        status: 403,
        message: 'User does not have permission to cancel this request.',
      };
    }
    if (
      (status === RequestStatus.denied &&
        !(<AccountRole[]>[AccountRole.approver, AccountRole.admin]).includes(user.role)) ||
      !request.room.approvers.some((x) => x.utorid == user.utorid)
    ) {
      return {
        status: 403,
        message: 'User does not have permission to deny this request.',
      };
    }
    const requestFetched = await db.request.update({
      where: { id },
      data: { status: status, reason },
      include: {
        group: true,
        room: true,
        author: { select: userSelector() },
      },
    });
    const context = {
      ...(await generateBaseNotificationContext(requestFetched)),
      changer_utorid: user.utorid,
      changer_full_name: user.name,
      status,
      reason,
    };
    await triggerMassNotification(EventTypes.BOOKING_STATUS_CHANGED, [requestFetched.author], context);
    await triggerAdminNotification(EventTypes.ADMIN_BOOKING_STATUS_CHANGED, context);
    return { status: 200, data: {} };
  },
  approveRequest: async (id: string, approver: User, reason?: string) => {
    return approveRequest(id, approver, reason);
  },
  updateRequest: async (
    request: CreateRequest & {
      id: string;
    },
    user: User,
  ) => {
    const error = await validateRequest(request);
    if (error) {
      return error;
    }
    const oldRequest = await db.request.findUnique({
      where: { id: request.id },
      include: {
        author: { select: { utorid: true } },
        group: { include: { managers: { select: { utorid: true } } } },
        approvers: { select: { utorid: true } },
      },
    });
    if (!oldRequest) {
      return { status: 404, message: 'Request ID not found.' };
    }
    if (
      user.role !== AccountRole.admin &&
      oldRequest.author.utorid !== user.utorid &&
      !oldRequest.group.managers.some((manager) => manager.utorid === user.utorid)
    ) {
      return {
        status: 403,
        message: 'User does not have permission to update this request.',
      };
    }
    const data = {
      startDate: new Date(request.startDate),
      endDate: new Date(request.endDate),
      title: request.title ?? oldRequest.title,
      description: request.description ?? oldRequest.description,
      room: { connect: { roomName: request.roomName ?? oldRequest } },
      approvers: {},
    };
    const approversObject: { disconnect?: object; connect?: object } = {};
    if (request.approvers) {
      if (request.approvers.length === 0) {
        approversObject.disconnect = {};
      } else {
        approversObject.connect = request.approvers.map((utorid) => ({ utorid }));
        approversObject.disconnect = oldRequest.approvers
          .map((x) => x.utorid)
          .filter((x) => !request.approvers?.includes(x))
          .map((utorid) => ({ utorid }));
      }
      data.approvers = approversObject;
    }
    const updatedRequest = await db.request.update({
      where: { id: request.id },
      data,
      include: { room: true, author: true, group: true },
    });
    await triggerAdminNotification(EventTypes.ADMIN_BOOKING_UPDATED, {
      ...(await generateBaseNotificationContext(updatedRequest)),
      changer_utorid: user.utorid,
      changer_full_name: user.name,
    });
    return { status: 200, data: {} };
  },
} satisfies Model;
