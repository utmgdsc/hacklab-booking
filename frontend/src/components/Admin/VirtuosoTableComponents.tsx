
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import React, { Ref } from 'react';
import { TableProps } from '@mui/material/Table/Table';
import { TableRowProps } from '@mui/material/TableRow/TableRow';
import { TableComponents } from 'react-virtuoso';

export const VirtuosoTableComponents: TableComponents = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref as Ref<any>} />),
    Table: (props: TableProps) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
    // @ts-expect-error - TableHead is not exported from @mui/material
    TableHead,
    TableRow: (props: TableRowProps) => <TableRow {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref as Ref<any>} />),
};
