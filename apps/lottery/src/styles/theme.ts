import { createTheme } from '@mui/material/styles';
// import ComponentsOverrides from './overrides';
import typography from './typography';

const theme = createTheme({
  palette: {
    primary: {
      main: '#285569',
      light: '#4B7588',
      dark: '#103849',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E5824B',
      light: '#F3C754',
      dark: '#D75341',
      contrastText: '#ffffff',
    },
    // background: {
    //   default: '#060b28',
    //   paper: '#0a0e23',
    // },
    text: {
      primary: '#000000',
      secondary: '#103849',
      //   disabled: '#dedede',
    },
    error: {
      main: '#d14343',
      light: '#e47575',
      contrastText: '#ffffff',
      dark: '#721717',
    },
    warning: {
      main: '#ffb043',
      contrastText: '#ffffff',
      light: '#ffbf68',
      dark: '#b27b2e',
    },
    success: {
      main: '#14b886',
      contrastText: '#ffffff',
      light: '#43c69e',
      dark: '#0e805d',
    },
    info: {
      main: '#fff', //'#2196f3',
      light: '#4dabf5',
      contrastText: '#000',
      dark: '#1769aa',
    },
    divider: 'rgba(0,0,0,0.16)',
  },
  typography,
  spacing: 8,
  direction: 'rtl',
  shape: {
    borderRadius: 10,
  },
});

// theme.components = ComponentsOverrides(theme);
export default theme;
