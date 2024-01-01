import React, { useCallback, useEffect, useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '../store/configStore';
import { fetchCurrentUser, setIdleDialog } from '../../features/account/accountSlice';
import Header from './Header';
import HomePage from '../../features/home/HomePage';
import LoadingComponent from './Loading';
import { minToMilliSecond } from '../utility/utils';
import TimerDialog from './TimerDialog';

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, showTimerDialog, showIdleDialog } = useAppSelector(state => state.account);
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try{
      await dispatch(fetchCurrentUser());
    }
    catch(error: any) {
      toast.error(error);
    }
  }, [dispatch]);
  
  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])

  useEffect(() => {
    if(user?.idleTimer != undefined) {
      console.log('Idle Timer', user.idleTimer);
      let inactivityTimer: NodeJS.Timeout | null = null;
  
      const resetTimer = () => {
         if (inactivityTimer !== null) {
          clearTimeout(inactivityTimer);
        }
        inactivityTimer = setTimeout(() => {
          dispatch(setIdleDialog(true));
        }, minToMilliSecond(user.idleTimer)); 
      };
  
      const handleActivity = () => {
        resetTimer();
      };
      
      // Initial setup
      resetTimer();
  
      // Event listeners for activity
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
  
      // Cleanup event listeners on component unmount
      return () => {
        if (inactivityTimer !== null) {
          clearTimeout(inactivityTimer);
        }
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
      };
    }
  }, [user?.idleTimer])

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      primary: {
        main: '#00B958'
      },
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
   })

   function handleThemeChange() {
    setDarkMode(!darkMode);
   }
    
   return(
    <ThemeProvider theme={theme}>
    <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
    <CssBaseline />
    {(user || showIdleDialog || showTimerDialog) && <TimerDialog />}
    <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
    {
        loading ? <LoadingComponent message="Initialising app..." /> 
                : location.pathname === '/' ? <HomePage />
                : <Container sx={{mt: 4}}> <Outlet /> </Container> 
      }
    </ThemeProvider>
   )
}

export default App;