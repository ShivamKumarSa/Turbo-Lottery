import { Box, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import bg from '../Images/home-bg.png';
import logo from '../Images/TLotteryLogo.png';
import logoShaper from '../Images/logo-shaper.png';
import theme from '../styles/theme';

export function App() {
  const navigate = useNavigate();
  localStorage.setItem('userType', 'LoggedOut');
  useEffect(() => {
    setTimeout(() => {
      if (window.location.pathname === '/') navigate('/login');
    }, 15000);
  }, []);

  return (
    <Box
      sx={{
        background: `url(${bg})`,
        height: '95vh',
        backgroundSize: '100% 100vh',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          justifyContent: 'center',
          mt: '25vh',
          ml: '10vw',
        }}
      >
        <Box
          sx={{
            color: `${theme.palette.primary.contrastText}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <img src={logo} alt="AppLogo" width="60px" />
          <Typography variant="h1" sx={{ fontWeight: 'medium' }}>
            Turbo Lottery.
          </Typography>
        </Box>
        <img src={logoShaper} alt="background" width="45%" />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'medium',
              color: `${theme.palette.primary.contrastText}aa`,
              textTransform: 'capitalize',
            }}
          >
            Online Lottery Platform
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'medium',
              color: `${theme.palette.primary.contrastText}55`,
              textTransform: 'capitalize',
            }}
          >
            Try Your Luck! Buy Lotteries.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
