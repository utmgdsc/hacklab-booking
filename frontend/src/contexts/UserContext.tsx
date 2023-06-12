import { createContext } from 'react';

export const defaultUser: User = {
    email: "hatsune.miku@utoronto.ca",
    utorid: "mikuhatsune",
    name: "Loading...",
    role: "student",
    theme: "system",
    groups: [],
    invited: [],
    requests: [],
    manager: [],
    rooms: []
}

export const UserContext = createContext(defaultUser);
