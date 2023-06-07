import { createContext } from 'react';
import { User } from '../types/user';

// todo old user data model
export const defaultUser: User = {
    _id: "",
    utorid: "noutorid",
    email: "noemail@example.com",
    name: "Loading...",
    role: "student",
    accessGranted: false,
    needsAccess: false,
    theme: "system"
}

export const UserContext = createContext(defaultUser);
