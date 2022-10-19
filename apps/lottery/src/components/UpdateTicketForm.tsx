import { Box, Button, Card, CardContent, Grid } from '@mui/material';
import React from 'react';
import theme from '../styles/theme';
import TicketCard from './TicketCard';

const UpdateTicketForm = ({ ticket }: any) => {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card raised sx={{ border: `2px solid ${theme.palette.primary.dark}` }}>
        <CardContent>
          <TicketCard data={ticket}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="outlined" sx={{ mt: '10px' }}>
                Update Priority
              </Button>
              <Button variant="contained" sx={{ mt: '10px' }}>
                Delete
              </Button>
            </Box>
          </TicketCard>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UpdateTicketForm;
