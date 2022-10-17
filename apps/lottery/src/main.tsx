import { ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './app/app';
import { Helmet } from 'react-helmet';

import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/Navbar';

import UserAuth from './Authentication/UserAuth';
import './main.css';
import Logo from './Images/TLotteryLogo.png';

import AdminAuth from './Authentication/AdminAuth';
import AdminDashboardUserView from './pages/AdminDashboardUserView';
import { SnackbarProvider } from 'notistack';
import ErrorPage from './pages/ErrorPage';
import PublicAuth from './Authentication/PublicAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import theme from './styles/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={5000} preventDuplicate>
          <BrowserRouter>
            <Helmet>
              <title>Turbo Lottery</title>
              <link rel="icon" type="image/png" href={Logo} sizes="32x32" />
            </Helmet>
            <Routes>
              <Route path="/" element={<Navbar />}>
                <Route
                  index
                  element={
                    <PublicAuth>
                      <App />
                    </PublicAuth>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicAuth>
                      <Login />
                    </PublicAuth>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicAuth>
                      <Register />
                    </PublicAuth>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <UserAuth>
                      <Dashboard />
                    </UserAuth>
                  }
                />
                <Route
                  path="/adminDashboard/ticket"
                  element={
                    <AdminAuth>
                      <AdminDashboard />
                    </AdminAuth>
                  }
                />
                <Route
                  path="/adminDashboard/user"
                  element={
                    <AdminAuth>
                      <AdminDashboardUserView />
                    </AdminAuth>
                  }
                />
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
