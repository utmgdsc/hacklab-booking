import { Logout as LogoutIcon } from "@mui/icons-material";

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import { InitialsAvatar, Link } from "../../components";
import { UserContext } from "../../contexts/UserContext";

/**
 * Left side of the header containing the user's name and role
 * @param {*} active_requests a list of requests received from the backend
 * @param {*} pending_requests a list of requests received from the backend
 * @param {*} userInfo to be passed by the UserContext
 * @param {*} theme to be passed by the useTheme MUI hook
 * @returns the left side of the header
 */
const LeftHeader = ({ active_requests, pending_requests, userInfo, theme }) => (
  <Box>
    <>
      <Typography
        component="p"
        variant="h5"
        sx={{ color: theme.palette.text.secondary }}
      >
        Welcome,{" "}
        {userInfo["role"] === "admin"
          ? "Administrator"
          : userInfo["role"] === "approver"
          ? "Approver"
          : null}
      </Typography>
      <Typography variant="h2">
        <strong>{userInfo["name"]}</strong>
      </Typography>
      {active_requests &&
        userInfo["role"] === "student" &&
        active_requests.length > 0 && (
          <Typography component="p" variant="h5">
            You have {active_requests.length} active requests
          </Typography>
        )}
      {pending_requests &&
        (userInfo["role"] === "admin" || userInfo["role"] === "approver") &&
        pending_requests.length > 0 && (
          <Typography
            component="p"
            variant="h5"
            sx={{ color: theme.palette.text.secondary }}
          >
            You have {pending_requests.length} pending requests
          </Typography>
        )}
    </>
  </Box>
);

/**
 * Right side of the header containing the user's initials and a menu to logout
 * @param {*} userInfo to be passed by the UserContext
 * @param {*} theme to be passed by the useTheme MUI hook
 * @returns the right side of the header
 */
const RightHeader = ({ userInfo, theme }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <InitialsAvatar name={userInfo["name"]} />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Link
          href="https://hacklabbooking.utm.utoronto.ca/Shibboleth.sso/Logout?return=https://cssc.utm.utoronto.ca/"
          sx={{ textDecoration: "none", color: theme.palette.text.primary }}
        >
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
            }}
          >
            <LogoutIcon fontSize="small" />
            <Typography>&nbsp;Logout</Typography>
          </MenuItem>
        </Link>
      </Menu>
    </Box>
  );
};

/**
 * the header for the dashboard: shows the name, role, and active/pending requests.
 * @param {*} active_requests a list of requests received from the backend
 * @param {*} pending_requests a list of requests received from the backend
 * @returns the header for the dashboard
 */
export const DashboardHeader = ({ active_requests, pending_requests }) => {
  const userInfo = useContext(UserContext);
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: {
          xs: "-2em",
          sm: "-1em",
          md: "0em",
          lg: "1em",
          xl: "2em",
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