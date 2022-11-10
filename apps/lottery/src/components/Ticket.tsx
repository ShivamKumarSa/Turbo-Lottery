import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
} from '@mui/material';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { creditHistoryInterface, messageEnum } from '@turbo-lottery/data';
import ConfirmDialog from './ConfirmDialog';
import TicketView from './TicketView';
import TicketCard from './TicketCard';
import theme from '../styles/theme';
import { useSnackbar } from 'notistack';

const Ticket = ({ data }: any) => {
  const [open, setOpen] = React.useState(false);
  const [ActivePlayers, setActivePlayers] = React.useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [socket, setSocket] = React.useState<any>(null);
  const [points, setPoints] = React.useState(0);
  const userId = localStorage.getItem('userId');
  const [timer, setTimer] = React.useState<number>(data.timer);
  const [message, setMessage] = React.useState<string>('');
  const [MessageType, setMessageType] = React.useState<messageEnum>();
  const [ConfirmOpen, confirmSetOpen] = React.useState(false);
  const [playerFilter, setPlayerFilter] = React.useState<boolean>(false);
  const [websocketResponse, setWebsocketResponse] =
    React.useState<boolean>(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickConfirmOpen = () => {
    confirmSetOpen(true);
  };

  useEffect(() => {
    ActivePlayers.length = data.maxplayers;
    const newSocket = io(`${process.env['NX_REACT_APP_BACKEND']}`);
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('join', {
        userId: localStorage.getItem('userId'),
        ticketId: data._id,
      });
    }
    if (socket) {
      socket.on(
        'message',
        (
          Message: string,
          ticketid: string | null,
          id: string | null,
          messageType: messageEnum
        ) => {
          if (ticketid === data._id) {
            if (messageType === 0) {
              if (id === userId) {
                setMessage(Message);
                setMessageType(messageType);
              }
            } else if (messageType === 1) {
              if (id === userId) {
                setMessage(Message);
                setMessageType(messageType);
              }
            } else {
              if (id !== userId) {
                setMessage(Message);
                setMessageType(messageType);
              }
            }
          }
        }
      );
      socket.on(
        'receive',
        (activePlayers: string[], ticketid: string | null) => {
          setWebsocketResponse(true);
          if (ticketid === data._id) {
            setActivePlayers(activePlayers);
            setPlayerFilter(
              activePlayers.filter((value) => {
                return value === userId;
              }).length > 0
                ? false
                : true
            );
          }
        }
      );
      socket.on('timer', (Timer: number, ticketid: string | null) => {
        if (ticketid === data._id) {
          setTimer(Timer);
        }
      });
      // socket.on(
      //   'winner',
      //   (WinnerMessage: string, id: string | null, ticketId: string | null) => {
      //     if (ticketId === data._id) {
      //       if (id === userId) {
      //         setMessage(WinnerMessage);
      //       }
      //     }
      //   }
      // );
      // socket.on(
      //   'public',
      //   (Message: string, id: string | null, ticketId: string | null) => {
      //     if (ticketId === data._id) {
      //       if (userId !== id) {
      //         setMessage(Message);
      //       }
      //     }
      //   }
      // );
      socket.on(
        'putCredit',
        (
          credit: number,
          CreditHistory: creditHistoryInterface[],
          id: string | null
        ) => {
          if (id === userId) {
            setPoints(credit);
          }
        }
      );
    }
  }, [socket, data, userId]);

  const handleSubmitButton = () => {
    if (socket) {
      socket.emit('boughtTicket', {
        userId: localStorage.getItem('userId'),
        ticketId: data._id,
      });
    }
    if (!open) {
      handleClickOpen();
    }
    enqueueSnackbar(`You bought ${data.ticketName}`, {
      preventDuplicate: true,
      variant: 'success',
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    });
  };
  const handleShowError = () => {
    let err;
    if (!playerFilter) {
      err = 'You already bought the ticket';
    } else if (ActivePlayers.length >= data.maxplayers) {
      err = "Draw is going on'";
    } else {
      err = 'You have less credit';
    }
    enqueueSnackbar(`${err}`, {
      preventDuplicate: true,
      variant: 'error',
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    });
  };

  return (
    <>
      {ConfirmOpen && (
        <ConfirmDialog
          open={ConfirmOpen}
          setOpen={confirmSetOpen}
          heading="Do you want to buy the ticket?"
          acceptFunction={handleSubmitButton}
        />
      )}
      <Grid item xs={12} md={6} lg={4}>
        <Card raised sx={{ border: `2px solid ${theme.palette.primary.dark}` }}>
          <CardContent>
            {websocketResponse && (
              <TicketCard data={data} ActivePlayers={ActivePlayers}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    mt: '10px',
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    sx={{ mr: '10px' }}
                  >
                    View
                  </Button>
                  {!playerFilter ||
                  ActivePlayers.length >= data.maxplayers ||
                  data.price > points ? (
                    <Button
                      variant="contained"
                      // disabled
                      // onClick={handleClickConfirmOpen}
                      disableElevation
                      disableRipple
                      sx={{
                        color: `${theme.palette.action.disabled}`,
                        backgroundColor: `${theme.palette.action.disabledBackground}`,
                        ':hover': {
                          color: `${theme.palette.action.disabled}`,
                          backgroundColor: `${theme.palette.action.disabledBackground}`,
                          // borderColor: `${theme.palette.action.disabled}`,
                        },
                      }}
                      // onMouseOver={handleShowError}
                      onClick={handleShowError}
                    >
                      Buy Now
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleClickConfirmOpen}
                    >
                      Buy Now
                    </Button>
                  )}
                </Box>
              </TicketCard>
            )}
            {!websocketResponse && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  my: '65px',
                  height: '100%',
                  width: '100%',
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      <TicketView
        data={data}
        message={message}
        MessageType={MessageType}
        timer={timer}
        ActivePlayers={ActivePlayers}
        points={points}
        open={open}
        setOpen={setOpen}
        setMessage={setMessage}
        confirmSetOpen={confirmSetOpen}
        handleShowError={handleShowError}
      />
    </>
  );
};

export default Ticket;
