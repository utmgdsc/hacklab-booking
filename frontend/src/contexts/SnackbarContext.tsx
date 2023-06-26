import { createContext } from 'react';

/**
 * The context for the global snackbar. Just use `enqueue` to display a
 * snackbar!
 */
export const SnackbarContext = createContext({
    /**
     * Displays a snackbar with the given message and action. By default it
     * automatically closes after 6000ms.
     *
     * Note that only one snackbar can be displayed at a time. If a snackbar
     * is already displayed, the new one will replace it.
     * @param message The message to display.
     * @param action An optional element to display as an action.
     */
    enqueue: (message: string, action?: JSX.Element) => {},
});
