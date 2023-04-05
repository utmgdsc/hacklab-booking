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

  useEffect(() => {
    document.title = 'Hacklab Booking - Dashboard';
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
            {userInfo["active_requests"] &&
              userInfo["active_requests"].length > 0 && (
                <Typography component="p" variant="h5">
                  You have {userInfo["active_requests"].length} active requests
                </Typography>
              )}
            {userInfo["pending_requests"] &&
              userInfo["pending_requests"].length > 0 && (
                <Typography component="p" variant="h5">
                  You have {userInfo["pending_requests"].length} pending
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
        <Tooltip title="Track an existing request" arrow placement="top">
          <Link to="/track" isInternalLink>
            <LabelledIconButton
              icon={<InventoryIcon />}
              color="#f35325"
              label="Track"
            />
          </Link>
        </Tooltip>

        <Tooltip
          title="Create a booking for Professors to review"
          arrow
          placement="top"
        >
          <Link to="/book" isInternalLink>
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
          <Link to="/group" isInternalLink>
            <LabelledIconButton
              icon={<PeopleIcon />}
              color="#05a6f0"
              label="Your Group"
            />
          </Link>
        </Tooltip>

        <Tooltip title="Access your settings" arrow placement="top">
          <Link to="/settings" isInternalLink>
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
            <Link to="/admin" isInternalLink>
              <LabelledIconButton
                icon={<AdminPanelSettingsIcon />}
                color="#7b00ff"
                label="Admin"
              />
            </Link>
          </Tooltip>
        )}
      </Box>

      {(userInfo["active_requests"] || userInfo["role"] === "student") && (
        <>
          <Typography variant="h2" gutterBottom>
            Your{" "}
            <acronym title="Booking requests that you have submitted">
              Active Requests
            </acronym>
          </Typography>
          <Typography variant="gray" component="em" gutterBottom>
            Your group(s) may also have active requests. Those may also be{" "}
            <Link isInternalLink href="/track">
              tracked
            </Link>
            .
          </Typography>
          {(!userInfo["active_requests"] ||
            userInfo["active_requests"].length === 0) && (
              <NoRequestsPlaceholder
                text={
                  "You have no active requests. Create one using the 'Book' button above."
                }
              />
            )}
          {userInfo["active_requests"]?.length > 0 &&
            userInfo["active_requests"].map((request) => {
              return (
                <ActiveRequestCard
                  key={request["title"]}
                  title={request["title"]}
                  description={request["description"]}
                  date={request["date"]}
                  location={request["location"]}
                  teamName={request["teamName"]}
                />
              );
            })}
        </>
      )}

      {(userInfo["pending_requests"] ||
        userInfo["role"] === "prof" ||
        userInfo["role"] === "admin") && (
          <>
            <Typography variant="h2" gutterBottom>
              Your{" "}
              <acronym title="Booking requests that demand your attention">
                Pending Requests
              </acronym>
            </Typography>
            {userInfo["pending_requests"] &&
              userInfo["pending_requests"].length === 0 && (
                <NoRequestsPlaceholder
                  text={"No requests demand your attention. Horray!"}
                />
              )}
            {userInfo["pending_requests"] &&
              userInfo["pending_requests"].length > 0 &&
              userInfo["pending_requests"].map((request) => {
                return (
                  <PendingRequestCard
                    key={request["title"]}
                    title={request["title"]}
                    description={request["description"]}
                    date={request["date"]}
                    name={request["name"]}
                    utorid={request["utorid"]}
                    location={request["location"]}
                    teamName={request["teamName"]}
                  />
                );
              })}
          </>
        )}
    </Container>
  );
};
