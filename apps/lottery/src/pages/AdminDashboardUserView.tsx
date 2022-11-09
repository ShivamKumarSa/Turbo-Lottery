import {
  CircularProgress,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useGetUsersQuery } from '../api';
import theme from '../styles/theme';
import AddCreditForm from '../components/AddCreditForm';
import { userInterface } from '@turbo-lottery/data';

export interface UserInterfaceWithId extends userInterface {
  _id: string | null;
}
const AdminDashboardUserView = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const response: any = useGetUsersQuery(token);

  if (response?.currentData) {
    return (
      <Box sx={{ m: '25px 20px' }}>
        <Typography
          variant="h2"
          sx={{
            my: '15px',
            display: 'flex',
            justifyContent: 'center',
            textDecoration: 'underline',
            color: `${theme.palette.primary.dark}`,
          }}
        >
          User Details
        </Typography>
        <TableContainer
          component={Paper}
          // sx={{ width: 650, maxHeight: 600 }}
        >
          <Table>
            <TableHead
              sx={{
                background: `${theme.palette.primary.main}`,
              }}
            >
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>Credit</StyledTableCell>
                <StyledTableCell>Add Credit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response.data
                .filter((value: UserInterfaceWithId) => {
                  return value._id !== userId;
                })
                .map((user: UserInterfaceWithId, index: number) => (
                  <AddCreditForm user={user} id={index + 1} key={index} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: '30px',
          height: '90%',
          width: '100%',
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.contrastText,
    fontSize: '20px',
    textTransform: 'capitalize',
  },
}));
export default AdminDashboardUserView;
