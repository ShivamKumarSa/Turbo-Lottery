import { Typography } from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';
import errorImage from '../Images/error-image.png';
import breadcrumb from '../Images/breadcrumb-title-shape.png';
import theme from '../styles/theme';

const ErrorPage = () => {
  return (
    <>
      <Header>
        <Typography
          variant="h5"
          sx={{ color: `${theme.palette.secondary.main}` }}
        >
          ERROR 404
        </Typography>
        <img src={breadcrumb} alt="breadcrumb" width="20%" />

        <Typography
          variant="h2"
          sx={{
            fontWeight: '600',
            color: `${theme.palette.primary.contrastText}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span>The page you’re looking for is</span>{' '}
          <span>now beyond our reach.</span>
        </Typography>
      </Header>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          margin: '50px 0px 70px',
        }}
      >
        <img src={errorImage} alt="404notFound" width="50%" />
      </div>
      <Footer />
    </>
  );
};

export default ErrorPage;
