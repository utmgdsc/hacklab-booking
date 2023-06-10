// todo old backend data model
declare interface Room {
    _id: string,
    roomName: string,
    friendlyName: string,
    capacity: number,
    requests: Array<Requests>,
}

export type { Room };
