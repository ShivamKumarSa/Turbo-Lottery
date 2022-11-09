import { Box, Typography } from '@mui/material';
import theme from '../styles/theme';
import bg from '../Images/footer-bg.png';
import logo from '../Images/TLotteryLogo.png';
import icon6 from '../Images/icon-6.png';
import icon2 from '../Images/icon-2.png';
import icon3 from '../Images/icon-3.png';
import icon4 from '../Images/icon-4.png';
import icon5 from '../Images/icon-5.png';

const Footer = () => {
  console.log('footer');
  return (
    <Box
      sx={{
        height: '30vh',
        background: `linear-gradient(90deg,${theme.palette.primary.main},${theme.palette.primary.dark},${theme.palette.primary.main});`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          position: 'relative',
        }}
      >
        <img src={bg} alt="background" height="100%" />
        <Box
          sx={{
            zIndex: '2',
            position: 'absolute',
            top: '5vh',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '15px',
              pb: '30px',
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
              <img src={logo} alt="AppLogo" width="40px" />
              <Typography
                variant="h3"
                sx={{ fontWeight: 'medium', letterSpacing: '-1px' }}
              >
                Turbo Lottery
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: `${theme.palette.primary.contrastText}99`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textTransform: 'capitalize',
              }}
            >
              <span>Lottery Players Can Play Turbo Lottery Online From</span>
              <span>Anywhere On A Phone, Tablet Or Computer.</span>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '15px',
              borderTop: `.1px solid ${theme.palette.primary.contrastText}55`,
              p: '15px 70px',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: `${theme.palette.primary.contrastText}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img src={logo} alt="AppLogo" width="25px" />
              Turbo Lottery is built with
              <img src={icon6} alt="icon6" width="22px" />
              <img src={icon2} alt="icon2" width="22px" />
              <img src={icon3} alt="icon3" width="20px" />
              <img src={icon4} alt="icon4" width="20px" />
              <img src={icon5} alt="icon5" width="18px" />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: `${theme.palette.primary.contrastText}`,
                textTransform: 'capitalize',
              }}
            >
              Copyright © 2022. All Right Reserved By Turbo Lottery
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
