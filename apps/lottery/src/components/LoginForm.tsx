import { ErrorMessage } from '@hookform/error-message';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import theme from '../styles/theme';

const LoginForm = ({ register, errors }: any) => {
  const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const [showPassword, changePasswordVisibility] =
    React.useState<boolean>(false);
  const handleClickChangePassword = () => {
    changePasswordVisibility(!showPassword);
  };
  return (
    <>
      <Grid item>
        <Typography variant="h5">Username</Typography>
      </Grid>
      <Grid item>
        <TextField
          required
          fullWidth
          placeholder="Enter Username"
          margin="dense"
          {...register('username')}
          error={errors['username'] ? true : false}
        />
        {errors['username'] ? (
          <span style={{ color: `${theme.palette.error.main}` }}>
            <ErrorMessage errors={errors} name="username" />
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </Grid>
      <Grid item>
        <Typography variant="h5">Password</Typography>
      </Grid>
      <Grid item>
        <TextField
          required
          onCopy={handleCopy}
          onPaste={handlePaste}
          type={showPassword ? 'text' : 'password'}
          // label="Required"
          placeholder="Enter Password"
          // type="password"
          fullWidth
          margin="dense"
          {...register('password')}
          error={errors['password'] ? true : false}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickChangePassword}
                  aria-label="toggle password visibility"
                  edge="end"
                  sx={{ color: theme.palette.primary.light }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors['password'] ? (
          <span style={{ color: `${theme.palette.error.main}` }}>
            <ErrorMessage errors={errors} name="password" />
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </Grid>
      <Outlet />
    </>
  );
};

export default LoginForm;
