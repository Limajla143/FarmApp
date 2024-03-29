import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Container, Paper, Avatar, Typography, Box, TextField, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function Register() {

    const navigate = useNavigate();

    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onTouched'
    })

    function handleApiErrors(errors: any) {
        if (Array.isArray(errors)) {
            errors.forEach((error: string, index: number) => {
                if (error.includes('Password')) {
                    setError('password', { message: error })
                } else if (error.includes('Email')) {
                    setError('email', { message: error })
                } else if (error.includes('Username')) {
                    setError('username', { message: error })
                }
            });
        }
        else if (typeof errors === 'string') {
            // Handle a single error message
            if (errors.includes('Password')) {
                setError('password', { message: errors });
            } else if (errors.includes('Email')) {
                setError('email', { message: errors });
            } else if (errors.includes('Username')) {
                setError('username', { message: errors });
            }
        }
        toast.error(errors.data.message);
    }

    return (
        <Container component={Paper} maxWidth='sm' sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
            Register
        </Typography>
        <Box component="form"
            noValidate sx={{ mt: 1 }}
            onSubmit={handleSubmit(data => agent.Account.register(data)
                .then(() => {
                    toast.success('Registration successful');
                    navigate('/confirmemail');
            })
            .catch(error => 
                handleApiErrors(error)           
            ))}
        >
            <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                autoFocus
                {...register('username', { required: 'Username is required' })}
                error={!!errors.username}
                helperText={errors?.username?.message as string}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                        value: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
                        message: 'Not a valid email address'
                    }
                })}
                error={!!errors.email}
                helperText={errors?.email?.message as string}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                {...register('password', { 
                    required: 'password is required',
                    pattern: {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                        message: 'Password does not meet complexity requirements'
                    }
                })}
                error={!!errors.password}
                helperText={errors?.password?.message as string}
            />
            <LoadingButton
                disabled={!isValid}
                loading={isSubmitting}
                type="submit"
                fullWidth
                variant="contained" sx={{ mt: 3, mb: 2 }}
            >
                Register
            </LoadingButton>
            <Grid container>
                <Grid item>
                    <Link to='/login' style={{ textDecoration: 'none' }}>
                        {"Already have an account? Sign In"}
                    </Link>
                </Grid>
            </Grid>
        </Box>
    </Container>
    )
}