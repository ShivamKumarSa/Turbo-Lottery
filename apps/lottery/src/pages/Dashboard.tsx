import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { ticketInterface } from '@turbo-lottery/data';
import { useGetTicketsQuery } from '../api';
import Header from '../components/Header';
import Ticket from '../components/Ticket';
import theme from '../styles/theme';
import breadcrumb from '../Images/breadcrumb-title-shape.png';
import Footer from '../components/Footer';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const response: any = useGetTicketsQuery(token);

  if (response?.data) {
    return (
      <>
        <Header>
          <Typography
            variant="h5"
            sx={{ color: `${theme.palette.secondary.main}` }}
          >
            LOTTERIES
          </Typography>
          <img src={breadcrumb} alt="breadcrumb" width="20%" />

          <Typography
            variant="h2"
            sx={{
              fontWeight: '600',
              color: `${theme.palette.primary.contrastText}`,
            }}
          >
            We Offer a Wide Variety of Lotteries
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: '400',
              color: `${theme.palette.primary.contrastText}aa`,
            }}
          >
            You Can't Win The Lottery, If You Don't Play.
          </Typography>
        </Header>
        <Box sx={{ m: '40px 20px' }}>
          <Grid container spacing={3} /* justifyContent="space-between" */>
            {[...response.data]
              // .sort((a: ticketInterface, b: ticketInterface) => {
              //   return a.priority - b.priority;
              // })
              .filter((ticket: ticketInterface) => {
                return ticket.active === true;
              })
              .map((ticket: ticketInterface) => (
                <Ticket data={ticket} key={ticket._id} />
              ))}
          </Grid>
        </Box>
        <Footer />
      </>
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

export default Dashboard;
