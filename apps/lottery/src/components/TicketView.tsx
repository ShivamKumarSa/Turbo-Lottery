import ArrowBack from '@mui/icons-material/ArrowBack';
import Close from '@mui/icons-material/Close';
import { Box, Button, Dialog, Grid, Paper, Typography } from '@mui/material';
import theme from '../styles/theme';
import Navbar from './Navbar';
import TicketHistory from './TicketHistory';
import banner from '../Images/sign-in-img.png';
import popper from '../Images/popper.gif';
import sparkle from '../Images/sparkle.gif';

const TicketView = ({
  data,
  message,
  MessageType,
  timer,
  ActivePlayers,
  points,
  open,
  setOpen,
  setMessage,
  confirmSetOpen,
  handleShowError,
}: any) => {
  const userId = localStorage.getItem('userId');
  const handleClose = () => {
    setOpen(false);
  };
  console.log('ticketview');
  const handleCloseMessage = () => {
    setMessage('');
  };
  const handleClickConfirmOpen = () => {
    confirmSetOpen(true);
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <Navbar />
      {message.length > 0 && (
        <Dialog
          open={message.length > 0 ? true : false}
          onClose={handleCloseMessage}
        >
          <Box
            sx={{
              background: `linear-gradient(145deg,${theme.palette.primary.dark},${theme.palette.primary.main},${theme.palette.primary.light});`,
              color: `${theme.palette.primary.contrastText}`,
              border: `2px solid ${theme.palette.primary.contrastText}`,
              borderRadius: '10px',
              position: 'relative',
            }}
          >
            {MessageType === 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: '30px 50px',
                  }}
                >
                  <Typography variant="h3" sx={{ textAlign: 'center' }}>
                    {message}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ textTransform: 'capitalize', textAlign: 'center' }}
                  >
                    {data.ticketName}
                  </Typography>
                </Box>
                <Button onClick={handleCloseMessage}>
                  <Close color="info" />
                </Button>
              </Box>
            )}

            {MessageType === 0 && (
              <>
                <img src={sparkle} alt="background" width="100%" />
                <Box
                  sx={{
                    zIndex: '2',
                    position: 'absolute',
                    top: '0vh',
                    width: '100%',
                  }}
                >
                  <Button
                    onClick={handleCloseMessage}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                    }}
                  >
                    <Close color="info" sx={{ m: '0px' }} />
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: '0px 30px',
                      gap: '5px',
                    }}
                  >
                    <img src={popper} alt="banner" width="30%" />
                    <Typography
                      variant="h2"
                      sx={{ textTransform: 'uppercase', fontWeight: '600' }}
                    >
                      Congratulations
                    </Typography>

                    <Typography variant="h5" sx={{ textAlign: 'center' }}>
                      {message}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        textTransform: 'capitalize',
                        textAlign: 'center',
                        fontWeight: '600',
                      }}
                    >
                      {data.ticketName}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {MessageType === 2 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: '20px 50px',
                    gap: '5px',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{ textTransform: 'capitalize', fontWeight: '600' }}
                  >
                    Better Luck Next Time!!!
                  </Typography>
                  <Typography variant="h5" sx={{ textAlign: 'center' }}>
                    {message}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      textTransform: 'capitalize',
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    {data.ticketName}
                  </Typography>
                </Box>
                <Button onClick={handleCloseMessage}>
                  <Close color="info" sx={{ mt: '10px' }} />
                </Button>
              </Box>
            )}
          </Box>
        </Dialog>
      )}
      <Box sx={{ m: '30px 30px 0px' }}>
        <Button
          onClick={handleClose}
          sx={{ fontWeight: '600', textTransform: 'capitalize' }}
        >
          <ArrowBack /> Back To Dashboard
        </Button>
        <Grid container spacing={10} width="100vw">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: '25px',
                  mt: '20px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: '300',
                      textTransform: 'capitalize',
                    }}
                  >
                    Ticket No.
                    <span style={{ fontWeight: '600' }}>
                      {data._id.slice(-5)}
                    </span>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: '400',
                    }}
                  >
                    Timer :{' '}
                    <span style={{ fontWeight: '600' }}>{timer}sec</span>
                  </Typography>
                </Box>
                <Typography
                  variant="h2"
                  sx={{ fontWeight: '600', textTransform: 'capitalize' }}
                >
                  {data.ticketName}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '5px',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: '500' }}>
                      {data.maxplayers - ActivePlayers.length}
                      <span style={{ fontWeight: '400' }}> out of </span>
                      {data.maxplayers}{' '}
                      <span
                        style={{
                          fontWeight: '400',
                          textTransform: 'lowercase',
                        }}
                      >
                        {' '}
                        tickets are available
                      </span>
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: '500' }}>
                      Amount:&nbsp;&nbsp;
                      <span style={{ fontWeight: '700' }}>{data.price}</span>
                    </Typography>
                    <Box sx={{ mt: '10px' }}>
                      {ActivePlayers.filter((value: string) => {
                        return value === userId;
                      }).length > 0 ||
                      ActivePlayers.length >= data.maxplayers ||
                      data.price > points ? (
                        <Button
                          variant="outlined"
                          // disabled
                          disableElevation
                          disableRipple
                          sx={{
                            color: `${theme.palette.action.disabled}`,
                            borderColor: `${theme.palette.action.disabled}`,
                            //   backgroundColor: `${theme.palette.action.disabledBackground}`,
                            ':hover': {
                              color: `${theme.palette.action.disabled}`,
                              backgroundColor: `${theme.palette.primary.contrastText}`,
                              borderColor: `${theme.palette.action.disabled}`,
                            },
                          }}
                          onClick={handleShowError}
                        >
                          Buy Now
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={handleClickConfirmOpen}
                        >
                          Buy Now
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        fontWeight: 'medium',
                      }}
                    >
                      {data.price * data.maxplayers}
                    </Typography>
                    <Typography variant="h5">Reward Price</Typography>
                  </Box>
                </Box>
              </Paper>
              <TicketHistory TicketId={data._id} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src={banner} alt="banner" width="90%" />
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default TicketView;
