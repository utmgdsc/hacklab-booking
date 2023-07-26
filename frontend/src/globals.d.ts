declare module '*.png';
declare module '*.svg';

/**
 * User model
 * Aligned with api/accounts
 */
interface User {
    email: string;
    name: string;
    role: UserRoles;
    theme: ThemeOptions;
    utorid: string;
    discordWebhook: string | null;
    slackWebhook: string | null;
    webhooks: UserWebhooks;
}
enum WebhookTypes {
  discord = 'discord',
  slack = 'slack',
  email = 'email',
}
type UserWebhooks = { [key: string]: WebhookTypes[] };

type UserRoles = 'student' | 'admin' | 'approver' | 'tcard';

type ThemeOptions = 'system' | 'light' | 'dark';

interface RoomsUser extends User {
    roomAccess: Room[];
}

interface FetchedUser extends RoomsUser {
    groups: FetchedGroup[];
    invited: FetchedGroup[];
    manager: FetchedGroup[];
    requests: FetchedRequest[];
}

type BookingStatus = 'pending' | 'denied' | 'cancelled' | 'needTCard' | 'completed';

/** Model Request  */
interface BookingRequest {
    id: string;
    authorUtorid: string;
    createdAt: Date;
    description: string;
    endDate: Date;
    groupId: string;
    reason: string | null;
    roomName: string;
    startDate: Date;
    status: BookingStatus;
    title: string;
    updatedAt: Date;
}

interface FetchedBookingRequest extends BookingRequest {
    approvers: User[];
    author: RoomsUser;
    group: Group;
    room: Room;
}

/** Model Group  */
interface Group {
    id: string;
    name: string;
}

interface MembersGroup extends Group {
    members: { utorid: string }[];
}

interface FetchedGroup extends MembersGroup {
    invited: User[];
    managers: User[];
    members: User[];
    requests: Request[];
}

/** Model Room */
interface Room {
    capacity: number | null;
    friendlyName: string;
    roomName: string;
}

/** Admin only fetched room when ~/api/rooms/:id is called */
interface FetchedRoom {
    capacity: number;
    friendlyName: string;
    requests: BookingRequest[];
    roomName: string;
    userAccess: User[];
}
