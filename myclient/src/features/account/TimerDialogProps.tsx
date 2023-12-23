
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { refreshToken, signOut } from "./accountSlice";
import { setShowTimerDialog } from "./accountActions";
import { Modal, Backdrop, Fade, Box, Typography, Button } from "@mui/material";

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
    const {showTimerDialog} = useAppSelector(state => state.account);
    const [timer, setTimer] = useState(60);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(showTimerDialog) {
          const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
          return () => clearInterval(interval);
        }
    }, [showTimerDialog]);
    
    const handleYesClick = () => {
        dispatch(refreshToken());
        isShowDialog();
        window.location.reload();
      };
    
      const handleNoClick = () => {
         dispatch(signOut());
         isShowDialog();
      };

      const isShowDialog = () => {
        dispatch(setShowTimerDialog(false));
      }
    
      useEffect(() => {
        if (timer <= 0) {
            dispatch(signOut());
            isShowDialog();
        }
      }, [timer]);
    
    return (
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
          <Button onClick={handleYesClick} variant='contained' color='inherit'>Yes</Button>
          <Button onClick={handleNoClick} variant='contained' color='inherit'>Cancel</Button>
        </Box>
      </Fade>
    </Modal>
	
    )
}