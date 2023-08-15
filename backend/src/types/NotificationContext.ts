import { RequestStatus } from '@prisma/client';

interface FullContext {
  receiver_utorid: string;
  receiver_full_name: string;
  receiver_email: string;
  frontend_url: string;
}

export type NotificationPartialContext = object;

export interface BaseBookingContext extends NotificationPartialContext {
  full_name: string;
  room: string;
  room_friendly: string;
  group_name: string;
  booking_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  utorid: string;
}

export type BookingCreatedContext = BaseBookingContext;

export interface BookingStatusChangeContext extends BaseBookingContext {
  changer_utorid: string;
  changer_full_name: string;
  status: RequestStatus;
  reason?: string;
}

interface ActionContext extends NotificationPartialContext {
  full_name: string;
  utorid: string;
}

export interface RoomContext extends NotificationPartialContext {
  room: string;
  room_friendly: string;
}

export type RoomActionContext = RoomContext & ActionContext;
export type RoomAccessRequestContext = RoomActionContext;

export interface RoomAccessContext extends RoomActionContext {
  approver_utorid: string;
  approver_full_name: string;
}

export interface RoomCreatedContext extends RoomActionContext {
  capacity: number;
}

export interface GroupContext extends NotificationPartialContext {
  group_name: string;
  group_id: string;
}

export type GroupActionContext = GroupContext & ActionContext;
export type GroupCreatedContext = GroupActionContext;

export interface GroupMemberInvitedContext extends GroupActionContext {
  inviter_utorid: string;
  inviter_full_name: string;
}

export interface GroupMemberRemovedContext extends GroupActionContext {
  remover_utorid: string;
  remover_full_name: string;
}

export interface GroupRoleChangedContext extends GroupActionContext {
  changer_utorid: string;
  changer_full_name: string;
  role: string;
}

export type AllContexts =
    BookingCreatedContext
    | BookingStatusChangeContext
    | RoomAccessRequestContext
    | RoomAccessContext
    | RoomCreatedContext
    | GroupCreatedContext
    | GroupMemberInvitedContext
    | GroupMemberRemovedContext
    | GroupRoleChangedContext;
export type NotificationFullContext = FullContext & AllContexts;
