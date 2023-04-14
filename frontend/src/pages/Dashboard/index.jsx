import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  CalendarToday as CalendarTodayIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";

import {
  Box,
  Container,
  Typography,
  useTheme
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  ActiveRequestCard,
  AppButtons,
  DashboardHeader,
  EditBooking,
  NoRequestsPlaceholder,
  PendingRequestCard
} from "../../components";
import { UserContext } from "../../contexts/UserContext";

/**
 * all active requests cards given a list of active requests
 * @param {*} active_requests a list of requests received from the backend
 * @param {*} editThisRequest a function that will be called when a user wants to edit a request
 * @param {*} cancelThisRequest a function that will be called when a user wants to cancel a request
 * @returns all active requests cards
 */
const ActiveRequestCards = ({ active_requests, editThisRequest, cancelThisRequest }) => (
  <>
    <Typography variant="h2" gutterBottom>
      Your Active Requests
    </Typography>
    {
      active_requests.length === 0 && (
        <NoRequestsPlaceholder text={"You have no active requests. Create one using the 'Book' button above."} />
      )
    }
    {
      active_requests.map((request) => {
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
      })
    }
  </>
)

/**
 * all pending requests cards given a list of pending requests
 * @param {*} pending_requests a list of requests received from the backend
 * @returns all pending requests cards
 */
const PendingRequestCards = ({ pending_requests }) => (
  <>
    <Typography variant="h2" gutterBottom>Your Pending Requests</Typography>
    {pending_requests.length === 0 && (
      <NoRequestsPlaceholder
        text={"No requests demand your attention. Horray!"}
      />
    )}
    {
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
)

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
        setPendingRequests(data);
      });
  }, []);

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

  const homeButtons = [
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
      <DashboardHeader active_requests={active_requests} pending_requests={pending_requests} />

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
        <AppButtons ButtonsToRender={homeButtons} />
      </Box>

      {openEditRequest && (
        <EditBooking
          isOpen={openEditRequest}
          reqID={editRequestID}
          setOpenEditRequest={setOpenEditRequest}
        />
      )}

      {userInfo["role"] === "admin" && (
        <PendingRequestCards pending_requests={pending_requests} />
      )}

      <ActiveRequestCards
        active_requests={active_requests}
        editThisRequest={editThisRequest}
        cancelThisRequest={cancelThisRequest}
      />

    </Container>
  );
};
