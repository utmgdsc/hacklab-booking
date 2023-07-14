import Model from '../types/Model';
import { AccountRole, Group, User } from '@prisma/client';
import db from '../common/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import logger from '../common/logger';

export default {
  getGroups: async (user: User) => {
    let groups: Group[];
    if (user.role === AccountRole.student) {
      groups = (await db.user.findUnique({ where: { utorid: user.utorid } }).groups({
        include: {
          members: true,
          invited: true,
          managers: true,
          requests: true,
        },
      })) as Group[];
    } else {
      groups = await db.group.findMany({
        include: {
          members: true,
          invited: true,
          managers: true,
          requests: true,
        },
      });
    }
    return { status: 200, data: groups };
  },
  getGroup: async (id: string, user: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        members: true,
        managers: true,
        invited: true,
        requests: true,
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (user.role === AccountRole.student && !group.members.some((x) => x.utorid === user.utorid)) {
      return {
        status: 403,
        message: "You are not allowed to access this group's information.",
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
        include: {
          members: true,
          managers: true,
          invited: true,
          requests: true,
        },
      });
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
        managers: { select: { utorid: true } },
        members: { select: { utorid: true } },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (!group.members.some((x) => x.utorid === targetUtorid)) {
      return { status: 400, message: 'User is not a member of this group.' };
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
      return { status: 200, data: {} };
    }
    if (role === 'member') {
      if (!group.managers.some((x) => x.utorid === targetUtorid)) {
        return { status: 400, message: 'User is already a member.' };
      }
      await db.group.update({
        where: { id },
        data: { managers: { disconnect: { utorid: targetUtorid } } },
      });
      return { status: 200, data: {} };
    }
    return { status: 400, message: 'Invalid role.' };
  },
  invite: async (id: string, utorid: string, manager: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        invited: { select: { utorid: true } },
        managers: { select: { utorid: true } },
        members: { select: { utorid: true } },
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
      await db.group.update({
        where: { id },
        data: { invited: { connect: { utorid } } },
      });
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
        invited: { select: { utorid: true } },
        members: { select: { utorid: true } },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (!group.invited.some((x) => x.utorid === user.utorid)) {
      return { status: 400, message: 'You are not invited to this group.' };
    }
    await db.group.update({
      where: { id },
      data: {
        invited: { disconnect: { utorid: user.utorid } },
        members: { connect: { utorid: user.utorid } },
      },
    });
    return { status: 200, data: {} };
  },
  rejectInvite: async (id: string, user: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        invited: { select: { utorid: true } },
        members: { select: { utorid: true } },
      },
    });
    if (!group) {
      return { status: 404, message: 'Group not found' };
    }
    if (!group.invited.some((x) => x.utorid === user.utorid)) {
      return { status: 400, message: 'You are not invited to this group.' };
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
        managers: { select: { utorid: true } },
        members: { select: { utorid: true } },
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
    return { status: 200, data: {} };
  },
  deleteGroup: async (id: string, manager: User) => {
    const group = await db.group.findUnique({
      where: { id },
      include: {
        managers: { select: { utorid: true } },
        members: { select: { utorid: true } },
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
    return { status: 200, data: {} };
  },
} satisfies Model;
