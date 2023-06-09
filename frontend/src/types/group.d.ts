// todo old backend data model
declare interface Group {
    _id: string,
    name: string,
    owner: User,
    members: Array<Users>,
    people?: Array<Users>,
    managers: Array<Users>,
    pendingMembers: Array<Users>,
    requests: Array<Requests>,
}

export type { Group };
