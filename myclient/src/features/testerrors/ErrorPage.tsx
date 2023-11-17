import { useState } from "react";
import agent from "../../app/api/agent";
import { Container, Typography, ButtonGroup, Button, Alert, AlertTitle, List, ListItem, ListItemText } from "@mui/material";

export default function ErrorPage() {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationError() {
        agent.TestErrors.getValidationError()
            .then(() => console.log('Should not see this'))
            .catch(error => setValidationErrors(error))
    }

    return (
        <Container>
        <Typography gutterBottom variant={'h2'}>Errors for testing purposes</Typography>
        <ButtonGroup fullWidth>
            <Button onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))} variant={'contained'}>Test 400 error</Button>
            <Button onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))} variant={'contained'}>Test 401 error</Button>
            <Button onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))} variant={'contained'}>Test 404 error</Button>
            <Button onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))} variant={'contained'}>Test 500 error</Button>
            <Button variant={'contained'}  onClick={getValidationError}>Test validation error</Button>
        </ButtonGroup> 
        {validationErrors.length > 0 &&   
            <Alert severity="error"> 
                <AlertTitle>Validation Errors</AlertTitle>
                <List>
                    {validationErrors.map(error => (
                        <ListItem key={error}>
                            <ListItemText>{error}</ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Alert>}
    </Container>
    )
}