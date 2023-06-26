import { createContext } from 'react';

export const SnackbarContext = createContext({
    enqueue: (message: string, action?: JSX.Element) => {},
});
