import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const {state} = useLocation();

    console.log(state);

    return (
        <Container component={Paper}>
            {state?.error ? (
                <>
                    <Typography gutterBottom variant="h4" color='secondary'>
                        {state.error.message}
                    </Typography>
                    <Divider />
                    <Typography variant="body1">{state.error.details || 'Internal server error'}</Typography> 
                </>
            ) : (
                <Typography gutterBottom variant='h5'>Server error</Typography> 
            )}

        </Container>
    )
}