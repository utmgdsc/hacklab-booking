import { Close as CloseIcon } from '@mui/icons-material';
import { AppBar, Container, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { CreateModifyBooking } from '../../pages/CreateBooking';
import { UserContext } from '../../contexts/UserContext';

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
    /** if the dialog is open or not */
    isOpen: boolean;
    /** function to change the state of opening/closing the dialog */
    setOpenEditRequest: (isOpen: boolean) => void;
    /** the children to render */
    children: React.ReactNode;
}) => {
    const { fetchUserInfo } = React.useContext(UserContext);

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
                            fetchUserInfo();
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
