import { Paper, TableCell, TableRow } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { Link, VirtuosoTableComponents } from "../../../components";
import { UserContext } from "../../../contexts/UserContext";
import { SubPage } from "../../../layouts/SubPage";
import axios from "../../../axios";

interface AllRequestTableRow {
  [key: string]: any;
  label: string;
  dataKey: string;
  subKey?: string;
}

const columns: AllRequestTableRow[] = [
  // { label: "id", dataKey: "_id" },
  { label: "title", dataKey: "title" },
  { label: "approval reason", dataKey: "reason" },
  { label: "status", dataKey: "status" },
  { label: "approvers", dataKey: "approvers" },
  { label: "group", dataKey: "group", subKey: "name" },
  { label: "room", dataKey: "room", subKey: "roomName" },
  { label: "start date", dataKey: "start_date" },
  { label: "end date", dataKey: "end_date" },
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

/**
 * Adds an hour to the end date
 * @param d a date string
 * @returns a date string with an hour added
 */
const addEndHour = (d: string) => {
  const date = new Date(d);
  date.setHours(date.getHours() + 1);
  return date.toLocaleString("en-ca", {
    timeZone: "EST",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const AllRequests = () => {
  const { userInfo } = useContext(UserContext);
  const [requests, setRequests] = useState(null);
  // TODO INTEGRATE

  // // useEffect hook for fetching the rows
  // useEffect(() => {
  //   fetch(process.env.REACT_APP_API_URL + "/requests/getAllRequests", {
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       // console.log(data);

  //       data.forEach((request) => {
  //         if (request["group"] === null) {
  //           request["group"] = { name: "Group Deleted" };
  //         }
  //       });

  //       setRequests(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <SubPage name="Request Log" maxWidth="xl">
      <Paper style={{ height: "90vh", width: "100%" }}>
        <TableVirtuoso
          data={requests}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={(index: number, row: AllRequestTableRow) => (
            <>
              {columns.map((column, index) => {
                if (column.dataKey === "start_date") {
                  return (
                    <TableCell key={index}>
                      {new Date(row[column.dataKey]).toLocaleString("en-ca", {
                        timeZone: "EST",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </TableCell>
                  );
                } else if (column.dataKey === "end_date") {
                  return (
                    <TableCell key={index}>
                      {addEndHour(row[column.dataKey])}
                    </TableCell>
                  );
                } else if (column.subKey) {
                  return (
                    <TableCell key={index}>
                      {row[column.dataKey][column.subKey]}
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
