import ArrowBack from '@mui/icons-material/ArrowBack';
import Close from '@mui/icons-material/Close';
import { Box, Button, Dialog, Grid, Paper, Typography } from '@mui/material';
import theme from '../styles/theme';
import Navbar from './Navbar';
import TicketHistory from './TicketHistory';
import banner from '../Images/sign-in-img.png';

const TicketView = ({
  data,
  message,
  timer,
  ActivePlayers,
  points,
  open,
  setOpen,
  setMessage,
  confirmSetOpen,
}: any) => {
  const userId = localStorage.getItem('userId');
  const handleClose = () => {
    setOpen(false);
  };
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
            className="winner"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: '20px 30px',
              background: `linear-gradient(145deg,${theme.palette.primary.dark},${theme.palette.primary.main},${theme.palette.primary.light});`,
              color: `${theme.palette.primary.contrastText}`,
              border: `2px solid ${theme.palette.primary.contrastText}`,
              borderRadius: '10px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
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
        </Dialog>
      )}
      <Box sx={{ m: '30px' }}>
        <Button onClick={handleClose} sx={{ fontWeight: '600' }}>
          <ArrowBack /> Back To Dashboard
        </Button>
        <Grid container spacing={10} width="100vw">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                alignItems: 'center',
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
                <Typography variant="h2" sx={{ fontWeight: '600' }}>
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
                      <span style={{ fontWeight: '400' }}>
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
                          disabled
                          onClick={handleClickConfirmOpen}
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
