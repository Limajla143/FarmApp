import { useState } from "react";
import { Container, Paper, Avatar, Typography, Box, TextField, Grid } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { signInUser } from "./accountSlice";
import { useAppDispatch } from "../../app/store/configStore";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import Pin from "./Pin";


export default function Login(){
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onTouched'
    });
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
      const submitRequest = () => {
        setOpen(false);
    };

    async function submitForm(data: FieldValues) {
        try {
            await dispatch(signInUser(data));
            navigate('/');
        } catch (error : any) {
            toast.error(error);
        }
    }
    return (
        <>
            <Pin isOpen={open} closeDialog={submitRequest} />

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
                    label="Email"
                    autoFocus
                    {...register('email', {required: 'Email is required!'})}
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
                <Grid container>
                   <Grid item>
                        <Link to='/forgotpassword' style={{ textDecoration: 'none' }}>
                            {"Forgot password?"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
        </>
    )
}