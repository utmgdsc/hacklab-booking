import { Close as CloseIcon } from '@mui/icons-material';
import { AppBar, Container, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { CreateModifyBooking } from '../../pages/CreateBooking';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTemplate = ({
    isOpen,
    setOpenEditRequest,
    children,
}: {
    isOpen: boolean;
    setOpenEditRequest: (isOpen: boolean) => void;
    children: React.ReactNode;
}) => {
    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={() => {
                setOpenEditRequest(false);
            }}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Edit Booking Request
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => {
                            setOpenEditRequest(false);
                        }}
                        aria-label="cancel"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {children}
        </Dialog>
    );
};

interface EditBookingProps {
    /** whether the dialog is open */
    isOpen: boolean;
    /** the request ID to edit */
    reqID: string;
    /** function to close the dialog */
    setOpenEditRequest: (isOpen: boolean) => void;
}

export const EditBooking = ({ isOpen, reqID, setOpenEditRequest }: EditBookingProps) => {
    return (
        <DialogTemplate isOpen={isOpen} setOpenEditRequest={setOpenEditRequest}>
            <Container maxWidth="md" sx={{ my: '5em' }}>
                <CreateModifyBooking editID={reqID} />
            </Container>
        </DialogTemplate>
    );
};
