import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

import React, {Ref} from "react";
import {TableProps} from "@mui/material/Table/Table";
import {TableRowProps} from "@mui/material/TableRow/TableRow";
import { TableComponents } from "react-virtuoso"

export const VirtuosoTableComponents: TableComponents = {
    Scroller: React.forwardRef((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref as Ref<any>} />
    )),
    Table: (props : TableProps) => (
        <Table
            {...props}
            sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
        />
    ),
    TableHead,
    TableRow: (props : TableRowProps) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => (
        <TableBody {...props} ref={ref as Ref<any>} />
    )),
};
