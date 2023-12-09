import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";

interface Props {
    isOpen: boolean;
    closeDialog: () => void;
}

export default function Pin({isOpen, closeDialog}: Props) {
    return (
        <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>PIN NUMBER</DialogTitle>
            <DialogContent>
                <DialogContentText>
                   ENTER PIN:
            </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="PIN NUMBER"
        type="number"
        fullWidth
        variant="standard"
      />
        </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Submit</Button>
            </DialogActions>
        </Dialog>

    )
}