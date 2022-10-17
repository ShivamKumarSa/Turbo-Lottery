import { Box, Typography } from '@mui/material';
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
      navigate('/login');
    }, 5000);
  }, []);
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <img src={bg} alt="background" width="100%" />
      <Box
        sx={{
          zIndex: '2',
          position: 'absolute',
          top: '24vh',
          left: '6vw',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            justifyContent: 'center',
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
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'medium',
              color: `${theme.palette.primary.contrastText}aa`,
            }}
          >
            Online Lottery Platform
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'medium',
                color: `${theme.palette.primary.contrastText}55`,
              }}
            >
              Try Your Luck! Buy Lotteries.
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
