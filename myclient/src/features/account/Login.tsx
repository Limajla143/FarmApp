import { Container, Paper, Avatar, Typography, Box, TextField, Grid } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { fetchCurrentUser, setUser, signInUser } from "./accountSlice";
import { useAppDispatch } from "../../app/store/configStore";
import { LoadingButton } from "@mui/lab";

export default function Login(){
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onTouched'
    })

    async function submitForm(data: FieldValues) {
        try {
            await dispatch(signInUser(data));
            navigate('/');
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <Container component={Paper} maxWidth='sm' sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" 
                onSubmit={handleSubmit(submitForm)} 
                noValidate sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    autoFocus
                    {...register('email', {required: 'Username is required!'})}
                    error={!!errors.email}
                    helperText={errors?.email?.message as string}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    autoFocus
                    {...register('password', {required: 'Password is required'})}
                    error={!!errors.password}
                    helperText={errors?.password?.message as string}
                />

                <LoadingButton loading={isSubmitting}
                    disabled={!isValid}
                    type="submit" 
                    fullWidth 
                    variant="contained" sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to='/register' style={{ textDecoration: 'none' }}>
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}