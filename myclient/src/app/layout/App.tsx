import React, { useCallback, useEffect, useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '../store/configStore';
import { fetchCurrentUser } from '../../features/account/accountSlice';
import Header from './Header';
import HomePage from '../../features/home/HomePage';
import LoadingComponent from './Loading';
import TimerDialog from '../../features/account/TimerDialogProps';

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { showTimerDialog } = useAppSelector(state => state.account);
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
    {showTimerDialog && <TimerDialog />}
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