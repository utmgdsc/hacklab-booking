import Model from '../types/Model';
import db from '../common/db';
import { Request } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export default {
  getRequests: async (filters:{ [key:string]:string }, admin:boolean) => {
    throw new Error('Not implemented');
  },
  createRequest: async (request: {
    description: string,
    title: string,
    roomId: number,
    reason: string | null,
    groupId: number,
    authorUtorid: string,
  }) => {
    if (request.title.trim() === '' || request.description.trim() === '') {
      return { status: 400, message: 'Missing required fields.' };
    }
    try {
      return {
        status: 200,
        data: <Request>(await db.request.create({ data: <Request>request })),
      };
    } catch (e) {
      if ((e as PrismaClientKnownRequestError).code === 'P2003') {
        return {
          status: 400,
          message: 'Invalid id for group, room or utorid.',
        };
      }
      throw e;
    }
  },
} satisfies Model;