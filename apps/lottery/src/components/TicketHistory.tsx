import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Box } from '@mui/system';
import { ticketHistoryInterface } from '@turbo-lottery/data';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import theme from '../styles/theme';

const TicketHistory = ({ TicketId }: { TicketId: string }) => {
  const [socket, setSocket] = React.useState<any>(null);
  const [ticketHistory, setTicketHistory] = React.useState<
    ticketHistoryInterface[]
  >([]);

  useEffect(() => {
    const newSocket = io(`${process.env['NX_REACT_APP_BACKEND']}`);
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('getTicketHistory', TicketId);
      socket.on(
        'putTicketHistory',
        (ticketData: ticketHistoryInterface[], ticketId: string) => {
          if (ticketId === TicketId) {
            setTicketHistory(ticketData);
          }
        }
      );
    }
  }, [socket, TicketId]);
  if (ticketHistory.length > 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 650, maxHeight: 300 }}
        >
          <Table sx={{ maxWidth: 650 }}>
            <TableHead
              sx={{
                background: `${theme.palette.primary.main}`,
              }}
            >
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Drawed On</StyledTableCell>
                <StyledTableCell>Winner Name</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...ticketHistory].reverse().map((data, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{data.playedOn}</StyledTableCell>
                  <StyledTableCell>{data.winner}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
  return <> </>;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.contrastText,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:first-of-type': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export default TicketHistory;
