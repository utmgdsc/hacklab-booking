// todo old backend data model
declare interface Request {
    _id?: string,
    status: "pending" | "denied" | "cancelled" | "approved" | "tcard" | "completed"
    group: Group,
    owner: User,
    approvers: String,
    start_date: Date,
    end_date: Date,
    description: String,
    title: String,
    room: Room,
    reason?: String,
}

export type { Request };
