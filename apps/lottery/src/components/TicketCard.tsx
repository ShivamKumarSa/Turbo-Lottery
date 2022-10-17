import { Box, Typography } from '@mui/material';

const TicketCard = ({ data, ActivePlayers, children }: any) => {
  return (
    <>
      <Box
        sx={{
          transform: 'rotate(90deg)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Reward Price
        </Typography>
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
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: '300',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Ticket No.{' '}
          <span style={{ fontWeight: '600' }}>{data._id.slice(-5)}</span>
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: '600' }}>
          {data.ticketName}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: '600' }}>
          Price:&nbsp;&nbsp;{data.price}
        </Typography>
        {ActivePlayers && (
          <Typography variant="h6" sx={{ fontWeight: '600' }}>
            {data.maxplayers - ActivePlayers.length}
            <span style={{ fontWeight: '400' }}> out of </span>
            {data.maxplayers}{' '}
            <span style={{ fontWeight: '400' }}> tickets are available</span>
          </Typography>
        )}
        {children}
      </Box>
    </>
  );
};

export default TicketCard;
