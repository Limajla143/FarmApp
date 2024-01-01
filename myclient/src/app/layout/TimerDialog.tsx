import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/configStore";
import { refreshToken,  setIdleDialog,  signOut } from "../../features/account/accountSlice";
import { setShowTimerDialog } from "../../features/account/accountActions";
import { Modal, Backdrop, Fade, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function TimerDialog() {
    const {showTimerDialog, showIdleDialog} = useAppSelector(state => state.account);
    const [timer, setTimer] = useState(60);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(showTimerDialog || showIdleDialog) {
          const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
          return () => clearInterval(interval);
        }
    }, [showIdleDialog, showTimerDialog]);
    
    const handleYesClick = () => {
      if(showTimerDialog) {
        dispatch(refreshToken());
      }
        isShowDialog();
        window.location.reload();
    };
    
    const handleNoClick = () => {
         dispatch(signOut());
         isShowDialog();
         navigate('/');
    };

      const isShowDialog = () => {
        dispatch(setShowTimerDialog(false));
        dispatch(setIdleDialog(false));
      }
    
      useEffect(() => {
        if (timer <= 0) {
            dispatch(signOut());
            isShowDialog();
            navigate('/');
        }
      }, [timer]);
    
      return (
        <>
          {showTimerDialog ? (
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={showTimerDialog}
              onClose={isShowDialog}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500
                },
              }}
            >
              <Fade in={showTimerDialog}>
                <Box sx={style}>
                  <Typography id="transition-modal-title" variant="h6" component="h2">
                  </Typography>
                  <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    {'Do you want to continue login? '}
                    {`Time remaining: ${timer} seconds`}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button onClick={handleYesClick} variant='contained' color='success' sx={{ marginRight: 1 }}>Yes</Button>
                    <Button onClick={handleNoClick} variant='contained' color='secondary'>Signout Now</Button>
                  </Box>
                </Box>
              </Fade>
            </Modal>
          ) : showIdleDialog ? (
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={showIdleDialog}
              onClose={isShowDialog}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500
                },
              }}
            >
              <Fade in={showIdleDialog}>
                <Box sx={style}>
                  <Typography id="transition-modal-title" variant="h6" component="h2">
                  </Typography>
                  <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    {'Your inactive in a while, do you want to continue? '}
                    {`Time remaining: ${timer} seconds`}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button onClick={handleYesClick} variant='contained' color='success' sx={{ marginRight: 1 }}>Yes</Button>
                    <Button onClick={handleNoClick} variant='contained' color='secondary'>Signout Now</Button>
                  </Box>
                </Box>
              </Fade>
            </Modal>
          ) : null}
        </>
      );
}