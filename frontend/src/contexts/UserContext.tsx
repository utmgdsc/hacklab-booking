import { createContext } from 'react';

export const defaultUser: FetchedUser = {
    email: 'hatsune.miku@utoronto.ca',
    utorid: 'mikuhatsune',
    name: 'Loading...',
    role: 'student',
    theme: 'system',
    groups: [],
    invited: [],
    requests: [],
    manager: [],
    roomAccess: [],
    discordWebhook: null,
    slackWebhook: null,
    webhooks: {} as UserWebhooks,
};

/**
 * The context for the user's information.
 */
export const UserContext = createContext({
    /**
     * The user's information. This is set to defaultUser until the user's
     * information is fetched from the backend.
     */
    userInfo: defaultUser,
    /**
     * Sets the user's information to the global state.
     * @param user the user's information to set
     */
    setUserInfo: (user: FetchedUser) => {},
    /**
     * Fetches the user's information from the backend and sets it to
     * the global state.
     */
    fetchUserInfo: async () => {},
});
