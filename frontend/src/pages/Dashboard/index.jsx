import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  CalendarToday as CalendarTodayIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import {
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  ActiveRequestCard,
  EditBooking,
  InitialsAvatar,
  LabelledIconButton,
  Link,
  NoRequestsPlaceholder,
  PendingRequestCard,
} from "../../components";
import { UserContext } from "../../contexts/UserContext";

export const Dashboard = () => {
  const userInfo = useContext(UserContext);
  const [pending_requests, setPendingRequests] = useState([]);
  const [active_requests, setActiveRequests] = useState([]);
  const [editRequestID, setEditRequestID] = useState(null);
  const [openEditRequest, setOpenEditRequest] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/requests/myRequests")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log("data");
        // console.log(data);
        setActiveRequests(data);
        setPendingRequests([]);
      });
  }, []);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/requests/allRequests")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data, "all requests");
        setPendingRequests(
          data.filter((request) => request.status === "pending")
        );
      });
  }, []);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const editThisRequest = (reqID) => {
    // console.log(reqID, "edit this request");
    setEditRequestID(reqID);
    setOpenEditRequest(true);
  };

  const cancelThisRequest = (reqID) => {
    // console.log(reqID, "cancel this request");
    // TODO: if request is completed, remove from calendar events
    fetch(process.env.REACT_APP_API_URL + "/requests/cancelRequest/" + reqID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setActiveRequests(
      active_requests.filter((request) => request._id !== reqID)
    );
  };

  const theme = useTheme();

  const AppButtons = [
    {
      title: "View the Hacklab Calendar",
      href: "/calendar",
      icon: <InventoryIcon />,
      label: "View Events",
      color: theme.palette.app_colors.red
    },
    {
      title: "Create a booking for Professors to review",
      href: "/book",
      icon: <CalendarTodayIcon />,
      label: "Book",
      color: theme.palette.app_colors.green
    },
    {
      title: "View the student group(s) you're in",
      href: "/group",
      icon: <PeopleIcon />,
      label: "Groups",
      color: theme.palette.app_colors.blue
    },
    {
      title: "View and edit your profile",
      href: "/settings",
      icon: <SettingsIcon />,
      label: "Settings",
      color: theme.palette.app_colors.yellow
    },
    {
      title: "Admin dashboard",
      href: "/admin",
      icon: <AdminPanelSettingsIcon />,
      label: "Admin",
      color: theme.palette.app_colors.purple,
      hidden: userInfo["role"] !== "admin"
    }
  ];

  return (
    <Container sx={{ py: 8 }} maxWidth="md" component="main">
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
        <Box>
          <>
            <Typography component="p" variant="h5" sx={{ color: theme.palette.text.secondary }}>
              Welcome,{" "}
              {userInfo["role"] === "admin"
                ? "Administrator"
                : userInfo["role"] === "prof"
                  ? "Professor"
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
              (userInfo["role"] === "admin" || userInfo["role"] === "prof") &&
              pending_requests.length > 0 && (
                <Typography component="p" variant="h5" sx={{ color: theme.palette.text.secondary }}>
                  You have {pending_requests.length} pending requests
                </Typography>
              )}
          </>
        </Box>

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
              <MenuItem onClick={() => { handleCloseUserMenu(); }}>
                <LogoutIcon fontSize="small" />
                <Typography>&nbsp;Logout</Typography>
              </MenuItem>
            </Link>
          </Menu>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "2em",
          marginBottom: "2em",
          flexWrap: "no-wrap",
          overflowX: "auto",
        }}
      >
        {
          AppButtons.map((button) => button["hidden"] ? null : (
            <Tooltip title={button["title"]} arrow placement="top" key={button["href"]}>
              <Link href={button["href"]} isInternalLink>
                <LabelledIconButton
                  icon={button["icon"]}
                  color={button["color"]}
                  label={button["label"]}
                />
              </Link>
            </Tooltip>
          ))
        }
      </Box>
      <Typography variant="h2" gutterBottom>
        Your Active Requests
      </Typography>
      {active_requests.length === 0 && (
        <NoRequestsPlaceholder
          text={
            "You have no active requests. Create one using the 'Book' button above."
          }
        />
      )}
      {active_requests.map((request) => {
        return (
          <ActiveRequestCard
            key={request["_id"]}
            reqID={request["_id"]}
            title={request["title"]}
            description={request["description"]}
            date={request["start_date"]}
            end={request["end_date"]}
            location={request["room"]["friendlyName"]}
            teamName={request["group"]["name"]}
            status={request["status"]}
            owner={request["owner"]["name"]}
            ownerHasTCard={request["owner"]["accessGranted"]}
            approver={request["approver"]["name"]}
            edit={editThisRequest}
            cancel={cancelThisRequest}
          />
        );
      })}

      {openEditRequest && (
        <EditBooking
          isOpen={openEditRequest}
          reqID={editRequestID}
          setOpenEditRequest={setOpenEditRequest}
        />
      )}

      {userInfo["role"] === "admin" && (
        <>
          <Typography variant="h2" gutterBottom>Your Pending Requests</Typography>
          {pending_requests && pending_requests.length === 0 && (
            <NoRequestsPlaceholder
              text={"No requests demand your attention. Horray!"}
            />
          )}
          {pending_requests &&
            pending_requests.length > 0 &&
            pending_requests.map((request) => {
              return (
                <PendingRequestCard
                  key={request["_id"]}
                  title={request["title"]}
                  description={request["description"]}
                  date={request["start_date"]}
                  end={request["end_date"]}
                  name={request["title"]}
                  ownerID={request["owner"]}
                  groupID={request["group"]}
                  locationID={request["room"]}
                  reqID={request["_id"]}
                />
              );
            })}
        </>
      )}
    </Container>
  );
};
