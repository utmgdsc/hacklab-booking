import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import { Inventory as InventoryIcon } from "@mui/icons-material";
import { TableVirtuoso } from "react-virtuoso";
import { SubPage } from "../../layouts/SubPage";
import { Link, LabelledIconButton } from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";

const columns = [
  { label: "UTORid", dataKey: "utorid" },
  { label: "Email", dataKey: "email" },
  // { label: 'Room Requested', dataKey: 'room' },
  // { label: 'Professor Approved', dataKey: 'prof' },
  { label: "Has Access", dataKey: "accessGranted" },
  { label: "Grant Access", dataKey: "accessGranted" },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

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
  const userInfo = useContext(UserContext);
  const [filterApproval, setFilterApproval] = useState(false);
  const [rowsToDisplay, setRowsToDisplay] = useState(null);
  const [rows, setRows] = useState(null);
  const [update, setUpdate] = useState(0);

  const theme = useTheme();

    // useEffect hook for fetching the rows
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/accounts/all', {
            method: 'GET',
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                setRows(data);
                setRowsToDisplay(data);
                setUpdate(Math.random());
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

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

  if (userInfo["role"] !== "admin") {
    return (
      <SubPage name="Admin">
        <Typography variant="h4" component="h1" gutterBottom>
          You are not an admin.{" "}
          <Link isInternalLink href="/">
            Go back
          </Link>
        </Typography>
      </SubPage>
    );
  }

  return (
    <SubPage name="Admin" maxWidth="xl">
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
        <Tooltip
          title="View all requests made by all students"
          arrow
          placement="top"
        >
          <Link href="/admin/all-requests" isInternalLink>
            <LabelledIconButton
              icon={<InventoryIcon />}
              color={theme.palette.app_colors.red}
              label="All Requests"
            />
          </Link>
        </Tooltip>
      </Box>
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
                if (index === 2) {
                  return (
                    <TableCell key={index}>
                      {row[column.dataKey] ? "Yes" : "No"}
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
