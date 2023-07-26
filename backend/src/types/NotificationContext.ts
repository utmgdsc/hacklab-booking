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
  approver_utorid: string;
  approver_full_name: string;
  reason: string;
}
export type AllContexts = BookingCreatedContext | BookingStatusChangeContext;
export type NotificationFullContext = FullContext & AllContexts;
