declare module '*.png';
declare module '*.svg';

/**
 * User model
 * Aligned with api/accounts
 */
interface User {
    email: string;
    utorid: string;
    name: string;
    role: UserRoles;
    theme: ThemeOptions;
}

type UserRoles = 'student' | 'admin' | 'approver' | 'tcard';

type ThemeOptions = 'system' | 'light' | 'dark';

interface RoomsUser extends User {
    roomAccess: Room[];
}

interface FetchedUser extends RoomsUser {
    groups: Group[];
    invited: Group[];
    requests: Request[];
    manager: Group[];
}

type BookingStatus = 'pending' | 'denied' | 'cancelled' | 'needTCard' | 'completed';

/** Model Request  */
interface BookingRequest {
    id: string;
    status: BookingStatus;
    groupId: string;
    authorUtorid: string;
    startDate: Date;
    endDate: Date;
    description: string;
    title: string;
    roomName: string;
    reason: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface FetchedBookingRequest extends BookingRequest {
    group: Group;
    author: RoomsUser;
    room: Room;
    approvers: User[];
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
    managers: User[];
    members: User[];
    invited: User[];
    requests: Request[];
}

/** Model Room */
interface Room {
    roomName: string;
    friendlyName: string;
    capacity: number | null;
}
