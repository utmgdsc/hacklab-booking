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
     * @param content An optional element to set the children of the snackbar.
     */
    enqueue: (message?: string, action?: JSX.Element, content?: JSX.Element) => {},
});

/**
 * An item in the snackbar queue that is displayed one at a time.
 */
export interface SnackbarQueueItem {
    /** The message that is queued to display */
    message?: string;
    /** An optional action to display along with the message */
    action?: JSX.Element | null;
    /** If this snack is open or not */
    open: boolean;
    /** The id of the snackbar */
    _id?: number;
    /** The content of the snackbar */
    content?: JSX.Element | null;
}
