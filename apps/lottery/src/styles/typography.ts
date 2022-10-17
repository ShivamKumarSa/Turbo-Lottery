import { TypographyOptions } from '@mui/material/styles/createTypography';

const pxToRem = (value: number) => `${value / 14}rem`;

const responsiveFontSizes = ({
  sm,
  md,
  lg,
}: {
  sm: number;
  md: number;
  lg: number;
}) => ({
  '@media (min-width:600px)': {
    fontSize: pxToRem(sm),
  },
  '@media (min-width:900px)': {
    fontSize: pxToRem(md),
  },
  '@media (min-width:1200px)': {
    fontSize: pxToRem(lg),
  },
});

const typography: TypographyOptions = {
  fontFamily: 'Source Sans Pro',
  fontSize: 14,
  fontWeightLight: 400,
  fontWeightRegular: 500,
  fontWeightMedium: 600,
  fontWeightBold: 800,
  htmlFontSize: 14,
  h1: {
    fontWeight: 500,
    lineHeight: 1.2,
    fontSize: pxToRem(28),
    ...responsiveFontSizes({ sm: 35, md: 45, lg: 50 }),
  },
  h2: {
    fontWeight: 400,
    lineHeight: 1.23,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 32, md: 34, lg: 36 }),
  },
  h3: {
    fontWeight: 400,
    lineHeight: 1.26,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 24, md: 28, lg: 30 }),
  },
  h4: {
    fontWeight: 500,
    lineHeight: 1.24,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 20, md: 22, lg: 26 }),
  },
  h5: {
    fontWeight: 500,
    lineHeight: 1.34,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
  },
  h6: {
    fontWeight: 500,
    lineHeight: 1.6,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ sm: 14, md: 14, lg: 14 }),
  },
  subtitle1: {
    fontWeight: 400,
    lineHeight: 1.75,
    fontSize: pxToRem(14),
  },
  subtitle2: {
    fontWeight: 400,
    lineHeight: 1.58,
    fontSize: pxToRem(10),
  },
  body1: {
    lineHeight: 1.5,
    fontWeight: 400,
    fontSize: pxToRem(14),
  },
  body2: {
    lineHeight: 1.45,
    fontWeight: 400,
    fontSize: pxToRem(10),
  },
  caption: {
    lineHeight: 1.66,
    fontWeight: 400,
    fontSize: pxToRem(10),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 500,
    lineHeight: 1.77,
    fontSize: pxToRem(16),
    textTransform: 'capitalize',
  },
};

export default typography;
