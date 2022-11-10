import { ErrorMessage } from '@hookform/error-message';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemText,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import theme from '../styles/theme';
import InfoIcon from '@mui/icons-material/Info';

const LoginForm = ({ register, errors, registerBool }: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [message, setMessage] = React.useState('');
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

  const [showConfirmPassword, changeConfirmPasswordVisibility] =
    React.useState<boolean>(false);

  const handleClickChangeConfirmPassword = () => {
    changeConfirmPasswordVisibility(!showConfirmPassword);
  };

  const open = Boolean(anchorEl);
  // let message;
  const handleInfo =
    (value: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
      setMessage(value);
    };

  return (
    <>
      {open && (
        <Popper open={open} anchorEl={anchorEl} placement="right">
          <Box
            sx={{
              border: `3px solid ${theme.palette.action.hover}`,
              p: 1,
              bgcolor: 'background.paper',
              ml: '40px',
              width: '15vw',
            }}
          >
            <List>
              {message === 'username' && (
                <>
                  <ListItemText>
                    Username can only contain alphabets and (underscore)_
                  </ListItemText>
                  <ListItemText>Minimum Length : 2 characters</ListItemText>
                  <ListItemText>Maximum Length : 20 characters</ListItemText>
                  <ListItemText>
                    Cannot inculde leading and trailing spaces
                  </ListItemText>
                </>
              )}
              {message === 'password' && (
                <>
                  <ListItemText>Password must contain :</ListItemText>
                  <ListItemText>- One small case letter</ListItemText>
                  <ListItemText>- One upper case letter</ListItemText>
                  <ListItemText>- One digit</ListItemText>
                  <ListItemText>- One special character(@$!%*#?&)</ListItemText>
                  <ListItemText>
                    Password would not have white spaces
                  </ListItemText>
                  <ListItemText>Minimum Length : 8 characters</ListItemText>
                  <ListItemText>Maximum Length : 20 characters</ListItemText>
                </>
              )}
              {message === 'cpassword' && (
                <ListItemText>
                  Confirm Password not match with Password
                </ListItemText>
              )}
            </List>
          </Box>
        </Popper>
      )}
      <Grid item>
        <Typography variant="h5">Username</Typography>
      </Grid>
      <Grid item>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '5px',
          }}
        >
          <TextField
            required
            fullWidth
            placeholder="Enter Username"
            margin="dense"
            {...register('username')}
            error={errors['username'] ? true : false}
          />
          {registerBool && (
            <Button onClick={handleInfo('username')}>
              <InfoIcon color="primary" />
            </Button>
          )}
        </Box>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '5px',
          }}
        >
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
          {registerBool && (
            <Button onClick={handleInfo('password')}>
              <InfoIcon color="primary" />
            </Button>
          )}
        </Box>
        {errors['password'] ? (
          <span style={{ color: `${theme.palette.error.main}` }}>
            <ErrorMessage errors={errors} name="password" />
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </Grid>
      {registerBool && (
        <>
          <Grid item>
            <Typography variant="h5">Confirm Password</Typography>
          </Grid>
          <Grid item>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '5px',
              }}
            >
              <TextField
                required
                placeholder="Enter Confirm Password"
                onCopy={handleCopy}
                onPaste={handlePaste}
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                margin="dense"
                {...register('confirmPassword')}
                error={errors['confirmPassword'] ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickChangeConfirmPassword}
                        aria-label="toggle password visibility"
                        edge="end"
                        sx={{ color: theme.palette.primary.light }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {registerBool && (
                <Button onClick={handleInfo('cpassword')}>
                  <InfoIcon color="primary" />
                </Button>
              )}
            </Box>
            {errors['confirmPassword'] ? (
              <span style={{ color: `${theme.palette.error.main}` }}>
                <ErrorMessage errors={errors} name="confirmPassword" />
              </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </Grid>
        </>
      )}
      <Outlet />
    </>
  );
};

export default LoginForm;
