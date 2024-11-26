declare module '*.png';
declare module '*.svg';
declare module '*.module.css';

/**
 * User model
 * Aligned with api/accounts
 */
interface User {
    email: string;
    name: string;
    role: UserRoles;
    utorid: string;
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
    theme: ThemeOptions;
    discordWebhook: string | null;
    slackWebhook: string | null;
    webhooks: UserWebhooks;
}

type BookingStatus = 'pending' | 'denied' | 'cancelled' | 'needTCard' | 'completed';

/** Model Request  */
interface BookingRequest {
    id: string;
    authorUtorid: string;
    createdAt: Date;
    description: string;
    endDate: string;
    groupId: string;
    group: {
        id: string;
        name: string;
    };
    reason: string | null;
    roomName: string;
    startDate: string;
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
    approvers: User[];
    capacity: number;
    friendlyName: string;
    requests: BookingRequest[];
    roomName: string;
    userAccess: User[];
}
