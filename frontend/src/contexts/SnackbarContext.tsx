import { AlertColor } from '@mui/material';
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
     * @param message The message to display.
     * @param action An optional element to display as an action.
     * @param content An optional element to set the children of the snackbar.
     */
    showSnack: (message?: string, action?: JSX.Element, content?: JSX.Element) => {},

    /**
     * Displays a snackbar with the given message and severity. By default it
     * automatically closes after 6000ms.
     * @param message The message to display.
     * @param sev The severity of the snackbar.
     */
    showSnackSev: (message?: string, sev?: AlertColor) => {},
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
