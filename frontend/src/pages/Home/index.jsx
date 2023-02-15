import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    LabelledIconButton,
    NoRequestsPlaceholder,
    PendingRequestCard
} from "../../components";
import {
    Typography,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem
} from "@mui/material";
import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "../../components";

export const Home = () => {
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
                    flexWrap: "wrap",
                    marginTop: "2em",
                    marginBottom: "2em"
                }}
            >
                <Box>
                    <Typography variant="h5">Welcome, Professor</Typography>
                    <Typography variant="h3"><strong>Hatsune Miku</strong></Typography>
                    <Typography variant="h5">1 request needs your attention</Typography>
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="Hatsune Miku">HM</Avatar>
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
                    flexWrap: "wrap",
                    marginTop: "2em",
                    marginBottom: "2em"
                }}
            >
                <LabelledIconButton icon={<InventoryIcon />} color="black" label="Track" />
                <LabelledIconButton icon={<CalendarTodayIcon />} color="black" label="Book" />
                <Link to="/settings" isInternalLink>
                    <LabelledIconButton icon={<SettingsIcon />} color="black" label="Settings"/>
                </Link>
            </Box>

            <Typography variant="h5" gutterBottom>Your Active Requests</Typography>
            {/* <NoRequestsPlaceholder text={"No active requests need your attention. Hooray!"} /> */}
            <PendingRequestCard
                title="Machine Learning Workshop"
                description="This workshop will teach you the basics of machine learning. We will be using Python and the TensorFlow library. If you have any questions, please contact the workshop leader, Arnold Schwarzenegger."
                date="2021-10-10"
                name="Arnold Schwarzenegger"
                utorid="scharno"
                location="DH 2014 (Hacklab)"
            />

            <Typography variant="h5" gutterBottom>Your Pending Requests</Typography>
            <NoRequestsPlaceholder text={"You don't have any pending requests. Click the \"Book\" button to get started!"}/>
        </Container>
    );
};
