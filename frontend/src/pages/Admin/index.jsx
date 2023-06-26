import { Inventory, MeetingRoom } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  TableCell,
  Tooltip,
  Typography,
  useTheme,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import {
  AppButtons,
  VirtuosoTableComponents,
  RoleChanger,
} from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { SubPage } from "../../layouts/SubPage";

const columns = [
  { label: "UTORid", dataKey: "utorid" },
  { label: "Email", dataKey: "email" },
  { label: "Role", dataKey: "role" },
  // { label: 'Room Requested', dataKey: 'room' },
  // { label: 'Professor Approved', dataKey: 'prof' },
  { label: "Has Access", dataKey: "accessGranted" },
  { label: "Grant Access", dataKey: "accessGranted" },
];

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

export const Admin = () => {
  const { userInfo } = useContext(UserContext);
  const [filterApproval, setFilterApproval] = useState(false);
  const [rowsToDisplay, setRowsToDisplay] = useState(null);
  const [rows, setRows] = useState(null);
  const [update, setUpdate] = useState(0);

  const theme = useTheme();

  const adminAppButtons = [
    {
      title: "View a list of all booking requests",
      href: "/admin/all-requests",
      icon: <Inventory />,
      label: "All Requests",
      color: theme.palette.app_colors.red,
    },
    {
      title: "Create, edit, and delete rooms",
      href: "/admin/room-manager",
      icon: <MeetingRoom />,
      label: "Manage Rooms",
      color: theme.palette.app_colors.green,
    },
  ];
  // TODO INTEGRATE

  // // useEffect hook for fetching the rows
  // useEffect(() => {
  //   fetch(process.env.REACT_APP_API_URL + "/accounts/all", {
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       setRows(data);
  //       setRowsToDisplay(data);
  //       setUpdate(Math.random());
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // useEffect hook for changing the rows to display based on the filter
  useEffect(() => {
    if (rows) {
      if (filterApproval) {
        setRowsToDisplay(
          rows.filter((row) => {
            return (
              row["accessGranted"] === false && row["needsAccess"] === true
            );
          })
        );
      } else {
        setRowsToDisplay(rows);
      }
    }
  }, [filterApproval, rows]);

  const needsApproval = (row, column) => {
    return (
      row["needsAccess"] &&
      column.dataKey === "accessGranted" &&
      row[column.dataKey] === false
    );
  };

  return (
    <SubPage name="Admin" maxWidth="xl">

      <AppButtons ButtonsToRender={adminAppButtons} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  id="filter-pending"
                  checked={filterApproval}
                  onChange={() => {
                    setFilterApproval(!filterApproval);
                  }}
                  name="filter-pending"
                />
              }
              label="Show only pending requests"
            />
          </FormControl>
        </Box>
      </Box>
      <Paper style={{ height: "90vh", width: "100%" }}>
        <TableVirtuoso
          data={rowsToDisplay}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={(index, row) => (
            <>
              {columns.map((column, index) => {
                if (index === 3) {
                  return (
                    <TableCell key={index}>
                      {row[column.dataKey] ? "Yes" : "No"}
                    </TableCell>
                  );
                } else if (index === 2) {
                  return (
                    <TableCell key={index}>
                      <Typography>{row[column.dataKey]}</Typography>
                      <RoleChanger
                        utorid={row["utorid"]}
                        userRole={row["role"]}
                        setUpdate={setUpdate}
                      />
                    </TableCell>
                  );
                } else if (needsApproval(row, column)) {
                  return (
                    <TableCell key={index}>
                      <Button
                        onClick={() => {
                          // send post request to api to grant access
                          fetch(
                            process.env.REACT_APP_API_URL +
                            "/accounts/modifyAccess/" +
                            row["utorid"],
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                accessGranted: true,
                              }),
                            }
                          )
                            .then((res) => {
                              return res.json();
                            })
                            .then((data) => {
                              console.log(data);
                            })
                            .catch((err) => {
                              console.log(err);
                            });

                          console.log("Granting access to " + row["utorid"]);
                          // update row['grant'] to true
                          row["accessGranted"] = true;
                          setUpdate(Math.random());
                        }}
                      >
                        Grant Access
                      </Button>
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell key={index}>{row[column.dataKey]}</TableCell>
                  );
                }
              })}
            </>
          )}
        />
      </Paper>
    </SubPage>
  );
};
