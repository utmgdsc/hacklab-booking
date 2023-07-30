import { Request } from '@prisma/client';
import db from '../common/db';
import { BaseBookingContext } from '../types/NotificationContext';

const fetchRequestData = async (request: Request) => {
  if (['room', 'author', 'group'].every((key) => request.hasOwnProperty(key) && typeof (<Record<string, any>>request)[key] === 'object')) {
    return request as NonNullable<typeof requestFetched>;
  }
  const requestFetched = await db.request.findUnique({
    where: { id: request.id },
    include: {
      room: true,
      author: true,
      group: true,
    },
  });
  if (!requestFetched) {
    throw new Error(`Request ${request.id} not found.`);
  }
  return requestFetched;
};
export const generateBaseRequestNotificationContext = async (request: Request): Promise<BaseBookingContext> => {
  const requestFetched = await fetchRequestData(request);
  return {
    full_name: requestFetched.author.name,
    utorid: requestFetched.author.utorid,
    title: requestFetched.title,
    description: requestFetched.description,
    room: requestFetched.roomName,
    room_friendly: requestFetched.room.friendlyName,
    start_date: requestFetched.startDate.toISOString(),
    end_date: requestFetched.endDate.toISOString(),
    booking_id: requestFetched.id,
    group_name: requestFetched.group.name,
  };
};