declare interface User {
    _id: string,
    utorid: string,
    email: string,
    name: string,
    role: "student" | "approver" | "admin",
    accessGranted: boolean,
    needsAccess: boolean,
    theme: "light" | "dark" | "system"
}

export type { User };
