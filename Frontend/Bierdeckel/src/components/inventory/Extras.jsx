import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MaterialUITable = () => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Header 1</TableCell>
                        <TableCell>Header 2</TableCell>
                        <TableCell>Header 3</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Data 1</TableCell>
                        <TableCell>Data 2</TableCell>
                        <TableCell>Data 3</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MaterialUITable;
