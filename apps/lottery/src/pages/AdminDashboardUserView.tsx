import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
      <Box sx={{ m: '25px' }}>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 650, maxHeight: 600 }}
        >
          <Table sx={{ maxWidth: 700 }}>
            <TableHead
              sx={{
                background: `${theme.palette.primary.main}`,
              }}
            >
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>IsAdmin</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Add Credit</TableCell>
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
export default AdminDashboardUserView;
