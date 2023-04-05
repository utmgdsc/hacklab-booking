import {
  CalendarToday as CalendarTodayIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from "@mui/icons-material";

import {
  LabelledIconButton,
  NoRequestsPlaceholder,
  ActiveRequestCard,
  InitialsAvatar,
  PendingRequestCard,
} from "../../components";
import {
  Typography,
  Box,
  Container,
  IconButton,
  Menu,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Avatar } from "@mui/material";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { Link } from "../../components";
import { UserContext } from "../../contexts/UserContext";

export const Dashboard = () => {
  const userInfo = useContext(UserContext);
  const [pending_requests, setPendingRequests] = useState([]);
  const [active_requests, setActiveRequests] = useState([]);

  useEffect(() => {
    document.title = 'Hacklab Booking - Dashboard';

    fetch(process.env.REACT_APP_API_URL + "/requests/myRequests")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        setActiveRequests(data);
        setPendingRequests(data.filter((request) => request.status === "pending"));
      });
  }, []);

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
          marginBottom: "2em",
        }}
      >
        <Box>
          <>
            <Typography component="p" variant="h5">
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
            {active_requests && userInfo["role"] === "student" &&
              active_requests.length > 0 && (
                <Typography component="p" variant="h5">
                  You have {active_requests.length} active requests
                </Typography>
              )}
            {pending_requests && (userInfo["role"] === "admin" || userInfo["role"] === "prof") &&
              pending_requests.length > 0 && (
                <Typography component="p" variant="h5">
                  You have {pending_requests.length} pending
                  requests
                </Typography>
              )}
          </>
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <InitialsAvatar name={userInfo["name"]} />
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
        <Tooltip title="View the Hacklab Calendar" arrow placement="top">
          <Link href="/calendar" isInternalLink>
            <LabelledIconButton
              icon={<InventoryIcon />}
              color="#f35325"
              label="View Events"
            />
          </Link>
        </Tooltip>

        <Tooltip
          title="Create a booking for Professors to review"
          arrow
          placement="top"
        >
          <Link href="/book" isInternalLink>
            <LabelledIconButton
              icon={<CalendarTodayIcon />}
              color="#81bc06"
              label="Book"
            />
          </Link>
        </Tooltip>

        <Tooltip
          title="View the student group you're associated with"
          arrow
          placement="top"
        >
          <Link href="/group" isInternalLink>
            <LabelledIconButton
              icon={<PeopleIcon />}
              color="#05a6f0"
              label="Your Group"
            />
          </Link>
        </Tooltip>

        <Tooltip title="Access your settings" arrow placement="top">
          <Link href="/settings" isInternalLink>
            <LabelledIconButton
              icon={<SettingsIcon />}
              color="#ffb900"
              label="Settings"
            />
          </Link>
        </Tooltip>

        {userInfo["role"] === "admin" && (
          <Tooltip
            title="Manage people who have Hacklab Access"
            arrow
            placement="top"
          >
            <Link href="/admin" isInternalLink>
              <LabelledIconButton
                icon={<AdminPanelSettingsIcon />}
                color="#7b00ff"
                label="Admin"
              />
            </Link>
          </Tooltip>
        )}
      </Box>

      {((active_requests && active_requests.length > 0) && userInfo["role"] === "student") && (
        <>
          <Typography variant="h2" gutterBottom>
            Your Active Requests
          </Typography>
          {(active_requests.length === 0) && (
              <NoRequestsPlaceholder
                text={
                  "You have no active requests. Create one using the 'Book' button above."
                }
              />
            )}
          {active_requests.map((request) => {
              console.log(request);
              return (
                <ActiveRequestCard
                  key={request["_id"]}
                  title={request["title"]}
                  description={request["description"]}
                  date={request["start_date"]}
                  location={request["room"]["name"]}
                  teamName={request["group"]["name"]}
                  status={request["status"]}
                />
              );
            })}
        </>
      )}

      {(pending_requests && pending_requests.length > 0) &&
        (userInfo["role"] === "prof" ||
        userInfo["role"] === "admin") && (
          <>
            <Typography variant="h2" gutterBottom>
              Your{" "}
              <acronym title="Booking requests that demand your attention">
                Pending Requests
              </acronym>
            </Typography>
            {pending_requests &&
              pending_requests.length === 0 && (
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
                    name={request["title"]}
                    utorid={request["owner"]}
                    location={request["room"]["friendlyName"]}
                    teamName={request["group"]["name"]}
                    reqID={request["_id"]}
                  />
                );
              })}
          </>
        )}
    </Container>
  );
};
