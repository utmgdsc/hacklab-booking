import { KeyboardArrowDown, Logout } from '@mui/icons-material';

import { Box, Button, Menu, MenuItem, Skeleton, Theme, Typography, useTheme } from '@mui/material';
import React, { SyntheticEvent, useContext } from 'react';
import { InitialsAvatar, Link } from '..';
import { UserContext } from '../../contexts/UserContext';

/**
 * Left side of the header containing the user's name and role
 * @property {*} active_requests a list of requests received from the backend
 * @property {*} pending_requests a list of requests received from the backend
 * @property {*} userInfo to be passed by the UserContext
 * @property {*} theme to be passed by the useTheme MUI hook
 * @returns the left side of the header
 */
const LeftHeader = ({
    active_requests,
    pending_requests,
    userInfo,
    theme,
}: {
    active_requests: BookingRequest[];
    pending_requests: BookingRequest[];
    userInfo: User;
    theme: any;
}) => (
    <Box>
        <Typography component="p" variant="h5" sx={{ color: theme.palette.text.secondary }}>
            Welcome, {userInfo.role === 'admin' ? 'Administrator' : userInfo.role === 'approver' ? 'Approver' : null}
        </Typography>
        <Typography variant="h2">
            {/* show a skeleton when loading. mikuhatsune is an impossible utorid due to its length */}
            {userInfo.utorid === 'mikuhatsune' && (
                <Typography variant="h2">
                    <Skeleton variant="text" width="5em" />
                </Typography>
            )}
            {/* show the user's name when loaded */}
            {userInfo.utorid !== 'mikuhatsune' && <strong>{userInfo.name}</strong>}
        </Typography>
        {active_requests && userInfo.role === 'student' && active_requests.length > 0 && (
            <Typography component="p" variant="h5">
                You have {active_requests.length} active request{active_requests.length > 1 && <>s</>}
            </Typography>
        )}
        {pending_requests &&
            (userInfo.role === 'admin' || userInfo.role === 'approver') &&
            pending_requests.length > 0 && (
                <Typography component="p" variant="h5" sx={{ color: theme.palette.text.secondary }}>
                    You have {pending_requests.length} pending request{pending_requests.length > 1 && <>s</>}
                </Typography>
            )}
    </Box>
);

/**
 * Right side of the header containing the user's initials and a menu to logout
 * @property {*} userInfo to be passed by the UserContext
 * @property {*} theme to be passed by the useTheme MUI hook
 * @returns the right side of the header
 */
const RightHeader = ({ userInfo, theme }: { userInfo: User; theme: Theme }) => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event: SyntheticEvent<any>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Button
                onClick={handleOpenUserMenu}
                sx={{ p: 0, borderRadius: '99em' }}
                endIcon={<KeyboardArrowDown />}
                color="inherit"
            >
                {/* show a skeleton when loading. mikuhatsune is an impossible utorid due to its length */}
                {userInfo.utorid === 'mikuhatsune' && <InitialsAvatar />}
                {/* show the user's name when loaded */}
                {userInfo.utorid !== 'mikuhatsune' && <InitialsAvatar name={userInfo.name} />}
            </Button>
            <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <Link
                    href="https://hacklabbooking.utm.utoronto.ca/Shibboleth.sso/Logout?return=https://cssc.utm.utoronto.ca/"
                    sx={{ textDecoration: 'none', color: theme.palette.text.primary }}
                    openInNewTab={false}
                >
                    <MenuItem
                        onClick={() => {
                            handleCloseUserMenu();
                        }}
                    >
                        <Logout fontSize="small" />
                        <Typography>&nbsp;Logout</Typography>
                    </MenuItem>
                </Link>
            </Menu>
        </Box>
    );
};

/**
 * the header for the dashboard: shows the name, role, and active/pending requests.
 * @property {BookingRequest[]} active_requests a list of requests received from the backend
 * @property {BookingRequest[]} pending_requests a list of requests received from the backend
 * @returns the header for the dashboard
 */
export const DashboardHeader = ({
    active_requests,
    pending_requests,
}: {
    active_requests: BookingRequest[];
    pending_requests: BookingRequest[];
}) => {
    const { userInfo } = useContext(UserContext);
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: {
                    xs: '-2em',
                    sm: '-1em',
                    md: '0em',
                    lg: '1em',
                    xl: '2em',
                },
            }}
        >
            <LeftHeader
                active_requests={active_requests}
                pending_requests={pending_requests}
                userInfo={userInfo}
                theme={theme}
            />
            <RightHeader userInfo={userInfo} theme={theme} />
        </Box>
    );
};
