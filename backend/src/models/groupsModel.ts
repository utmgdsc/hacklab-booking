import { AccountRole, Group, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import db from '../common/db';
import logger from '../common/logger';
import Model from '../types/Model';
import { userSelector } from './utils';
import {
  triggerAdminNotification, triggerMassNotification, triggerNotification,
  triggerUserNotification,
} from '../notifications';
import EventTypes from '../types/EventTypes';
import {
  generateGroupContext,
  generateUserActionContext,
} from '../notifications/generateContext';
import { AllContexts } from '../types/NotificationContext';

const groupInclude = () => ({
  members: { select: userSelector() },
  managers: { select: userSelector() },
  invited: { select: userSelector() },
  requests: true,
});
const notifyGroupManagers = async (event: EventTypes, group: Group, context: AllContexts) => {
  let managers: User[];
  if (!('managers' in group) || (group.managers as User[]).some((x) => !('webhooks' in x) || !Array.isArray(x.webhooks))) {
    const groupFetched = await db.group.findUnique({
      where: { id: group.id },
      include: {
        managers: true,
      },
    });
    if (!groupFetched) {
      return;
    }
    managers = groupFetched.managers as User[];
  } else {
    managers = group.managers as User[];
  }
  if (managers.length === 0) {
    return;
  }
  await triggerMassNotification(event, managers, context);
};

export default {
  getGroups: async (user: User) => {
    let groups: Group[];
    if (user.role === AccountRole.student) {
      groups = (await db.user.findUnique({ where: { utorid: user.utorid } }).groups({
        include: groupInclude(),
      })) as Group[];
    } else {
      groups = await db.group.findMany({
        include: groupInclude(),
      });
    }
    return { status: 200, data: groups };
  },
  getGroup: async (id: string, user: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: groupInclude(),
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (user.role === AccountRole.student && !group.members.some((x) => x.utorid === user.utorid)) {
      return {
        status: 403,
        message: 'You are not allowed to access this group\'s information.',
      };
    }
    return { status: 200, data: group };
  },

  createGroup: async (name: string, user: User) => {
    try {
      const group = await db.group.create({
        data: {
          name,
          managers: { connect: { utorid: user.utorid } },
          members: { connect: { utorid: user.utorid } },
        },
        include: groupInclude(),
      });
      await triggerAdminNotification(EventTypes.ADMIN_GROUP_CREATED, { ...generateUserActionContext(user), ...generateGroupContext(group) });
      return { status: 200, data: group };
    } catch (e) {
      logger.debug((e as PrismaClientKnownRequestError).code);
      if ((e as PrismaClientKnownRequestError).code === 'P2002') {
        return { status: 400, message: 'Group name already exists.' };
      }
      throw e;
    }
  },
  changeRole: async (id: string, targetUtorid: string, role: 'manager' | 'member', manager: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        managers: true,
        members: true,
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    const user = group.members.find((x) => x.utorid === targetUtorid);
    if (!user) {
      return {
        status: 400,
        message: 'User is not a member of this group.',
      };
    }
    if (manager.role !== AccountRole.admin && !group.managers.some((x) => x.utorid === manager.utorid)) {
      return {
        status: 403,
        message: 'You are not allowed to modify this group.',
      };
    }
    if (role === 'manager') {
      if (group.managers.some((x) => x.utorid === targetUtorid)) {
        return { status: 400, message: 'User is already a manager.' };
      }
      await db.group.update({
        where: { id },
        data: { managers: { connect: { utorid: targetUtorid } } },
      });
    }
    if (role === 'member') {
      if (!group.managers.some((x) => x.utorid === targetUtorid)) {
        return { status: 400, message: 'User is already a member.' };
      }
      await db.group.update({
        where: { id },
        data: { managers: { disconnect: { utorid: targetUtorid } } },
      });
    } else {
      return { status: 400, message: 'Invalid role.' };
    }
    const context = {
      ...generateUserActionContext(user), ...generateGroupContext(group),
      role: role as 'manager' | 'member',
      changer_utorid: manager.utorid,
      changer_full_name: manager.name,
    };
    await notifyGroupManagers(EventTypes.GROUP_ROLE_CHANGED, group, context);
    await triggerUserNotification(EventTypes.USER_GROUP_ROLE_CHANGED, user, context);
    return { status: 200, data: {} };
  },
  invite: async (id: string, utorid: string, manager: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        invited: { select: userSelector() },
        managers: { select: userSelector() },
        members: { select: userSelector() },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (manager.role !== AccountRole.admin && !group.managers.some((x) => x.utorid === manager.utorid)) {
      return {
        status: 403,
        message: 'You are not allowed to modify this group.',
      };
    }
    try {
      if (group.invited.some((x) => x.utorid === utorid)) {
        return { status: 400, message: 'User is already invited.' };
      }
      if (group.members.some((x) => x.utorid === utorid)) {
        return { status: 400, message: 'User is already a member.' };
      }
      const groupFetched = await db.group.update({
        where: { id },
        data: { invited: { connect: { utorid } } },
        include: {
          invited: true,
          managers: true,
        },
      });
      const context = {
        ...generateUserActionContext(groupFetched.invited.find(x => x.utorid === utorid) as User),
        ...generateGroupContext(groupFetched),
        inviter_utorid: manager.utorid,
        inviter_full_name: manager.name,
      };
      await notifyGroupManagers(EventTypes.GROUP_MEMBER_INVITED, groupFetched, context);
      await triggerUserNotification(EventTypes.USER_INVITED_TO_GROUP, groupFetched.invited.find(x => x.utorid === utorid) as User, context);
      return { status: 200, data: {} };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2025') {
        return { status: 404, message: 'User not found.' };
      }
      throw e;
    }
  },
  acceptInvite: async (id: string, user: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        invited: { select: userSelector() },
        members: { select: userSelector() },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (!group.invited.some((x) => x.utorid === user.utorid)) {
      return {
        status: 400,
        message: 'You are not invited to this group.',
      };
    }
    await db.group.update({
      where: { id },
      data: {
        invited: { disconnect: { utorid: user.utorid } },
        members: { connect: { utorid: user.utorid } },
      },
    });
    await notifyGroupManagers(EventTypes.GROUP_MEMBER_JOINED, group, {
      ...generateUserActionContext(user),
      ...generateGroupContext(group),
    });
    return { status: 200, data: {} };
  },
  rejectInvite: async (id: string, user: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        invited: { select: userSelector() },
        members: { select: userSelector() },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (!group.invited.some((x) => x.utorid === user.utorid)) {
      return {
        status: 400,
        message: 'You are not invited to this group.',
      };
    }
    await db.group.update({
      where: { id },
      data: { invited: { disconnect: { utorid: user.utorid } } },
    });
    return { status: 200, data: {} };
  },
  removeMember: async (id: string, utorid: string, manager: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        managers: { select: userSelector() },
        members: { select: userSelector() },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    // user must be either admin, a group manager. or trying to remove themselves
    if (manager.role !== AccountRole.admin && !group.managers.some((x) => x.utorid === manager.utorid) && manager.utorid !== utorid) {
      return {
        status: 403,
        message: 'You are not allowed to modify this group.',
      };
    }
    if (manager.utorid === utorid && group.managers.length === 1) {
      return {
        status: 403,
        message: 'You cannot remove yourself from the group if you are the only manager, either delete the group or make a new manager.',
      };
    }
    if (!group.members.some((x) => x.utorid === utorid)) {
      return {
        status: 400,
        message: 'User is not a member of this group.',
      };
    }
    await db.group.update({
      where: { id },
      data: {
        members: { disconnect: { utorid } },
        managers: { disconnect: { utorid } },
      },
    });
    const user = group.members.find(x => x.utorid === utorid) as User;
    const context = {
      ...generateUserActionContext(user),
      ...generateGroupContext(group),
      remover_utorid: manager.utorid,
      remover_full_name: manager.name,
    };
    await notifyGroupManagers(EventTypes.GROUP_MEMBER_REMOVED, group, context);
    await triggerUserNotification(EventTypes.USER_REMOVED_FROM_GROUP, user, context);
    return { status: 200, data: {} };
  },
  deleteGroup: async (id: string, manager: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        managers: { select: userSelector() },
        members: { select: userSelector() },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (manager.role !== AccountRole.admin && !group.managers.some((x) => x.utorid === manager.utorid)) {
      return {
        status: 403,
        message: 'You are not allowed to modify this group.',
      };
    }
    await db.group.delete({ where: { id } });
    const context = {
      ...generateUserActionContext(manager),
      ...generateGroupContext(group),
    };
    await notifyGroupManagers(EventTypes.GROUP_DELETED, group, context);
    await triggerAdminNotification(EventTypes.GROUP_DELETED, context);
    return { status: 200, data: {} };
  },
} satisfies Model;
