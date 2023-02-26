import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import {
    LabelledIconButton,
    NoRequestsPlaceholder,
    ActiveRequestCard,
    InitialsAvatar,
    PendingRequestCard
} from "../../components";
import {
    Typography,
    Box,
    Container,
    IconButton,
    Menu,
    Tooltip,
    MenuItem
} from "@mui/material";
import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "../../components";

export const Dashboard = () => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Container sx={{ py: 8 }} maxWidth="md" component="main">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    marginTop: {
                        xs: "-2em",
                        sm: "-1em",
                        md: "0em",
                        lg: "1em",
                        xl: "2em",
                    },
                    marginBottom: "2em"
                }}
            >
                <Box>
                    <Typography component="p" variant="h5">Welcome, Professor</Typography>
                    <Typography variant="h2"><strong>Hatsune Miku</strong></Typography>
                    <Typography component="p" variant="h5">1 request needs your attention</Typography>
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <InitialsAvatar name="Hatsune Miku" />
                    </IconButton>
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
                        <MenuItem onClick={handleCloseUserMenu}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    alignItems: "center",
                    marginTop: "2em",
                    marginBottom: "2em",
                    flexWrap: "no-wrap",
                    overflowX: "auto",
                }}
            >
                <Tooltip title="Track an existing request" arrow placement="top">
                    <Link to ="/track" isInternalLink>
                        <LabelledIconButton icon={<InventoryIcon />} color="#f35325" label="Track" />
                    </Link>
                </Tooltip>

                <Tooltip title="Create a booking for Professors to review" arrow placement="top">
                    <Link to="/book" isInternalLink>
                        <LabelledIconButton icon={<CalendarTodayIcon />} color="#81bc06" label="Book" />
                    </Link>
                </Tooltip>

                <Tooltip title="Add an event to the CSSC calendar" arrow placement="top">
                    <Link to="/" isInternalLink>
                        <LabelledIconButton icon={<CalendarViewDayIcon />} color="#05a6f0" label="Create Event" />
                    </Link>
                </Tooltip>

                <Tooltip title="Access your settings" arrow placement="top">
                    <Link to="/settings" isInternalLink>
                        <LabelledIconButton icon={<SettingsIcon />} color="#ffb900" label="Settings"/>
                    </Link>
                </Tooltip>
            </Box>

            <Typography variant="h2" gutterBottom>Your Active Requests</Typography>
            {/* <NoRequestsPlaceholder text={"No active requests need your attention. Hooray!"} /> */}
            <ActiveRequestCard
                title="Machine Learning Workshop"
                description="This workshop will teach you the basics of machine learning. We will be using Python and the TensorFlow library. If you have any questions, please contact the workshop leader, Arnold Schwarzenegger."
                date="2021-10-10"
                name="Arnold Schwarzenegger"
                utorid="scharno"
                location="DH 2014 (Hacklab)"
            />

            <Typography variant="h2" gutterBottom>Your Pending Requests</Typography>
            {/* <NoRequestsPlaceholder text={"You don't have any pending requests. Click the \"Book\" button to get started!"}/> */}
            <PendingRequestCard
                title="Machine Learning Workshop"
                description="This workshop will teach you the basics of machine learning. We will be using Python and the TensorFlow library. If you have any questions, please contact the workshop leader, Arnold Schwarzenegger."
                date="2021-10-10"
                name="Arnold Schwarzenegger"
                utorid="scharno"
                location="DH 2014 (Hacklab)"
            />
        </Container>
    );
};
