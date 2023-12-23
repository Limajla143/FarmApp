import { accountSlice } from "./accountSlice";

export const setShowTimerDialog = (showTimerDialog: boolean) => (dispatch: any) => {
    dispatch(accountSlice.actions.setShowTimerDialog(showTimerDialog));
  
    if (!showTimerDialog) {
      dispatch(accountSlice.actions.setRefreshTokenTimeout(null));
    }
  };
