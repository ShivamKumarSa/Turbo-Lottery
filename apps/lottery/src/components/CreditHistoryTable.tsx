import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { creditHistoryInterface } from '@turbo-lottery/data';
import { memo } from 'react';

interface creditHistoryTableInterface {
  creditHistory: creditHistoryInterface[];
  length: number;
}
const CreditHistoryTable = ({
  creditHistory,
  length,
}: creditHistoryTableInterface) => {
  console.log('credit history table');
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Balance</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...creditHistory]
            .reverse()
            .slice(
              0,
              creditHistory.length === length ? creditHistory.length : length
            )
            .map((history, index) => (
              <TableRow key={index}>
                <StyledTableCell>{history.description}</StyledTableCell>
                <StyledTableCell align="center">
                  {history.transaction}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {history.balance}
                </StyledTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.dark,
    fontSize: 20,
    textTransform: 'capitalize',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
export default memo(CreditHistoryTable);
