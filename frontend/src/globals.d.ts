declare module '*.png';
declare module '*.svg';

/** Model User  */
type User = {
    email: string
    utorid: string
    name: string
    role: "student" | "admin" | "approver" | "tcard"
    theme: "system" | "light" | "dark"
}

/** Model Request  */
type Request = {
    id: string
    status: RequestStatus
    groupId: number
    authorUtorid: string
    startDate: Date
    endDate: Date
    description: string
    title: string
    roomName: string
    reason: string | null
    createdAt: Date
    updatedAt: Date
}

/** Model Group  */
type Group = {
    id: string
    name: string
    managers: User[]
    members: User[]
    requests: Request[]
}

/** Model Room */
type Room = {
    roomName: string
    friendlyName: string
    capacity: number | null
}
