import { Box } from '@mui/material';
import theme from '../styles/theme';
import leftBg from '../Images/left-bg.png';
import rightBg from '../Images/right-bg.png';

const Header = ({ children }: any) => {
  console.log('headre');
  return (
    <Box
      sx={{
        height: '45vh',
        background: `linear-gradient(90deg,${theme.palette.primary.main},${theme.palette.primary.dark},${theme.palette.primary.main});`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <img src={leftBg} alt="leftbg" width="25%" height="150%" />
        <Box
          sx={{
            zIndex: '2',
            position: 'absolute',
            top: '15vh',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '25px',
            }}
          >
            {children}
          </Box>
        </Box>
        <img src={rightBg} alt="rightbg" width="25%" height="150%" />
      </Box>
    </Box>
  );
};

export default Header;
