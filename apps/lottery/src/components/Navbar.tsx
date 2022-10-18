import {
  AppBar,
  appBarClasses,
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Menu,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../Images/TLotteryLogo.png';
import theme from '../styles/theme';
import { io } from 'socket.io-client';
import { creditHistoryInterface } from '@turbo-lottery/data';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import CreditHistoryTable from './CreditHistoryTable';
import ConfirmDialog from './ConfirmDialog';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const [points, setPoints] = React.useState<number>(0);
  const [socket, setSocket] = React.useState<any>(null);
  const [open, setOpen] = React.useState(false);
  const [ConfirmOpen, confirmSetOpen] = React.useState(false);
  const [anchorElCredit, setAnchorElCredit] =
    React.useState<null | HTMLElement>(null);
  const [creditHistory, setCreditHistory] = React.useState<
    creditHistoryInterface[]
  >([]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickConfirmOpen = () => {
    confirmSetOpen(true);
  };

  const handleOpenCreditMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCredit(event.currentTarget);
  };
  const handleCloseCreditMenu = () => {
    setAnchorElCredit(null);
  };

  useEffect(() => {
    if (userId) {
      const newSocket = io(`${process.env['NX_REACT_APP_BACKEND']}`);
      setSocket(newSocket);
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      if (socket) {
        socket.emit('getCredit', userId);
      }

      if (socket) {
        socket.on(
          'putCredit',
          (
            credit: number,
            CreditHistory: creditHistoryInterface[],
            id: string | null
          ) => {
            if (id === userId) {
              setPoints(credit);
              setCreditHistory(CreditHistory);
            }
          }
        );
      }
    }
  }, [socket, userId]);

  const handleCloseUserMenu = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.setItem('userType', 'LoggedOut');
    localStorage.removeItem('userId');
    enqueueSnackbar("You've been successfully logged out", {
      preventDuplicate: true,
      variant: 'success',
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    });
    navigate('/login');
  };

  return (
    <>
      {ConfirmOpen && (
        <ConfirmDialog
          open={ConfirmOpen}
          setOpen={confirmSetOpen}
          heading="Do you want to logout?"
          acceptFunction={handleCloseUserMenu}
        />
      )}
      <MyAppBar
        position="sticky"
        sx={{
          borderBottom: `.1px solid ${theme.palette.primary.contrastText}55`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <NavLink
              to="/"
              style={{
                textDecoration: 'none',
                color: `${theme.palette.primary.contrastText}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img src={logo} alt="AppLogo" width="40px" />
              <Typography
                variant="h3"
                sx={{ fontWeight: 'medium', letterSpacing: '-1px' }}
              >
                Turbo Lottery
              </Typography>
            </NavLink>
            <Box
              sx={{
                display: 'flex',
                gap: '30px',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexGrow: 1,
              }}
            >
              {!userId && (
                <>
                  <NavLink
                    to="/login"
                    style={({ isActive }) =>
                      isActive
                        ? {
                            display: 'none',
                          }
                        : {
                            textDecoration: 'none',
                            color: `${theme.palette.primary.contrastText}`,
                          }
                    }
                  >
                    <Typography variant="h5">Sign In</Typography>
                  </NavLink>
                  <NavLink
                    to="/register"
                    style={({ isActive }) =>
                      isActive
                        ? {
                            display: 'none',
                          }
                        : {
                            textDecoration: 'none',
                            color: `${theme.palette.primary.contrastText}`,
                          }
                    }
                  >
                    <Typography variant="h5">Sign Up</Typography>
                  </NavLink>
                </>
              )}
              {userId && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {userType === 'User' && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                      }}
                    >
                      <Typography
                        textAlign="center"
                        variant="h5"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        Hi {localStorage.getItem('name')}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Typography variant="h5">Credits</Typography>
                        <Button
                          sx={{
                            color: 'white',
                            p: '0px',
                            m: 0,
                            background: `linear-gradient(145deg,${theme.palette.secondary.dark},${theme.palette.secondary.main},${theme.palette.secondary.light});`,
                          }}
                          onClick={handleOpenCreditMenu}
                        >
                          {points}
                        </Button>
                      </Box>

                      {creditHistory.length > 0 && (
                        <Menu
                          sx={{ mt: '50px' }}
                          id="menu-appbar"
                          anchorEl={anchorElCredit}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorElCredit)}
                          onClose={() => setAnchorElCredit(null)}
                        >
                          <CreditHistoryTable
                            creditHistory={creditHistory}
                            length={5}
                          />
                          {creditHistory.length > 5 && (
                            <Button
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              onClick={() => {
                                handleCloseCreditMenu();
                                handleClickOpen();
                              }}
                            >
                              View More...
                            </Button>
                          )}
                        </Menu>
                      )}
                    </Box>
                  )}
                  {userType === 'Admin' && (
                    <>
                      <NavLink
                        to="/adminDashboard/ticket"
                        style={({ isActive }) =>
                          isActive
                            ? {
                                display: 'none',
                              }
                            : {
                                textDecoration: 'none',
                                color: `${theme.palette.primary.contrastText}`,
                              }
                        }
                      >
                        <Typography variant="h5">Tickets</Typography>
                      </NavLink>
                      <NavLink
                        to="/adminDashboard/user"
                        style={({ isActive }) =>
                          isActive
                            ? {
                                display: 'none',
                              }
                            : {
                                textDecoration: 'none',
                                color: `${theme.palette.primary.contrastText}`,
                              }
                        }
                      >
                        <Typography variant="h5">Users</Typography>
                      </NavLink>
                    </>
                  )}
                  <Button onClick={handleClickConfirmOpen}>
                    <Typography
                      sx={{
                        color: 'white',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip title="logout">
                        <LogoutIcon />
                      </Tooltip>
                    </Typography>
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </MyAppBar>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            background: `${theme.palette.primary.dark}`,
            mb: '10px',
          }}
        >
          <DialogTitle>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'medium',
                color: `${theme.palette.primary.contrastText}`,
              }}
            >
              Credit Points History
            </Typography>
          </DialogTitle>
          <Button onClick={handleClose}>
            <CloseIcon sx={{ width: '20px' }} />
          </Button>
        </Box>
        <CreditHistoryTable
          creditHistory={creditHistory}
          length={creditHistory.length}
        />
      </Dialog>
      <Outlet />
    </>
  );
};

const MyAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${appBarClasses.root}`]: {
    background: `linear-gradient(90deg,${theme.palette.primary.main},${theme.palette.primary.dark},${theme.palette.primary.main});`,
  },
}));

export default Navbar;
