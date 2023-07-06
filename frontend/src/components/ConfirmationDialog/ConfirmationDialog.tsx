import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";

interface ConfirmationDialogProps {
    /** react useState hook if the dialog is open or not */
    open: boolean;
    /** react useState hook to set the open state */
    setOpen: (open: boolean) => void;
    /** the title of the dialog */
    title: string;
    /** the description of the dialog */
    description: string;
    /** the function to call when the user confirms */
    onConfirm: () => void;
    /** the text to display on the yes button */
    yesText?: string;
}

/**
 * A dialog that asks the user to confirm an action before proceeding
 * Yes/no buttons.
 *
 * @param {boolean} open react useState hook if the dialog is open or not
 * @param {Function} setOpen react useState hook to set the open state
 * @param {string} title the title of the dialog
 * @param {string} description the description of the dialog
 * @param {Function} onConfirm the function to call when the user confirms (clicks yes)
 * @param {string} yesText the text to display on the yes button
 */
export const ConfirmationDialog = ({ open, setOpen, title, description, onConfirm, yesText }: ConfirmationDialogProps) => {
    const dialogID: string = Math.random().toString();

    return (
        <Dialog
            open={open}
            aria-labelledby={dialogID}
        >
            <DialogTitle id={dialogID}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ paddingBottom: "0" }}>
                <DialogContentText component={Typography} gutterBottom>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    margin: "1em",
                }}
            >
                <Button onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={() => { setOpen(false); onConfirm() }}
                    variant="contained"
                >
                    {yesText || "Yes"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
