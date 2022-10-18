import { Box, Button, Card, CardContent, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { creditHistoryInterface } from '@turbo-lottery/data';
import ConfirmDialog from './ConfirmDialog';
import TicketView from './TicketView';
import TicketCard from './TicketCard';
import theme from '../styles/theme';

const Ticket = ({ data }: any) => {
  const [open, setOpen] = React.useState(false);
  const [ActivePlayers, setActivePlayers] = React.useState<string[]>([]);

  const [socket, setSocket] = React.useState<any>(null);
  const [points, setPoints] = React.useState(0);
  const userId = localStorage.getItem('userId');
  const [timer, setTimer] = React.useState<number>(data.timer);
  const [message, setMessage] = React.useState<string>('');
  const [ConfirmOpen, confirmSetOpen] = React.useState(false);

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
        'receive',
        (activePlayers: string[], ticketid: string | null) => {
          if (ticketid === data._id) {
            setActivePlayers(activePlayers);
          }
        }
      );
      socket.on(
        'message',
        (Message: string, ticketid: string | null, id: string | null) => {
          if (ticketid === data._id) {
            if (id === userId) {
              setMessage(Message);
            }
          }
        }
      );
      socket.on('timer', (Timer: number, ticketid: string | null) => {
        if (ticketid === data._id) {
          setTimer(Timer);
        }
      });
      socket.on(
        'winner',
        (WinnerMessage: string, id: string | null, ticketId: string | null) => {
          if (ticketId === data._id) {
            if (id === userId) {
              setMessage(WinnerMessage);
            }
          }
        }
      );
      socket.on(
        'public',
        (Message: string, id: string | null, ticketId: string | null) => {
          if (ticketId === data._id) {
            if (userId !== id) {
              setMessage(Message);
            }
          }
        }
      );
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
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
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
                  variant="outlined"
                  onClick={handleClickOpen}
                  sx={{ mr: '10px' }}
                >
                  View
                </Button>
                {ActivePlayers.filter((value) => {
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
                  <Button variant="outlined" onClick={handleClickConfirmOpen}>
                    Buy Now
                  </Button>
                )}
              </Box>
            </TicketCard>
          </CardContent>
        </Card>
      </Grid>
      <TicketView
        data={data}
        message={message}
        timer={timer}
        ActivePlayers={ActivePlayers}
        points={points}
        open={open}
        setOpen={setOpen}
        setMessage={setMessage}
        confirmSetOpen={confirmSetOpen}
      />
    </>
  );
};

export default Ticket;
