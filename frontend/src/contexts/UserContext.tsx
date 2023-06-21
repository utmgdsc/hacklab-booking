import { createContext } from 'react';

export const defaultUser: FetchedUser = {
    email: "hatsune.miku@utoronto.ca",
    utorid: "mikuhatsune",
    name: "Loading...",
    role: "student",
    theme: "system",
    groups: [],
    invited: [],
    requests: [],
    manager: [],
    roomAccess: []
}

export const UserContext = createContext({userInfo:defaultUser, setUserInfo: (user: FetchedUser) => {}});
