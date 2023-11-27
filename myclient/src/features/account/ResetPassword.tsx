import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Container, Paper, Avatar, Typography, Box, TextField, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";

export default function ResetPassword() {
    const { email, token } = useParams<{ email?: string; token?: string }>();
    const navigate = useNavigate();

    const {register, handleSubmit, setError, watch, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onTouched'
    });

    function handleApiErrors(errors: any) {
        if (Array.isArray(errors)) {
            errors.forEach((error: string, index: number) => {
                if (error.includes('Password')) {
                    setError('password', { message: error })
                }  else if (error.includes('NewPassword')) {
                    setError('newpassword', { message: error })
                }
            });
        }
        else if (typeof errors === 'string') {
            if (errors.includes('Password')) {
                setError('password', { message: errors });
            } else if (errors.includes('NewPassword')) {
                setError('newpassword', { message: errors });
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
            Reset Password
        </Typography>
        <Box component="form"
            noValidate sx={{ mt: 1 }}
            onSubmit={handleSubmit(data => { 
                const formData = {
                    email: email,
                    token: token,
                    password: data.password,
                    newpassword: data.newpassword
                  };

             agent.Account.resetPassword(formData)
                .then(response => {
                    if(response.statusCode == 200) {
                        toast.success(response.message);
                        navigate('/login');
                    }
                    else {
                        toast.error(response.message);
                    }
            })
            .catch(error => {
                handleApiErrors(error)
            })             
            })
        }
        >
            <TextField
                margin="normal"
                required
                fullWidth
                {...register('email')}
                defaultValue={email}
                disabled
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
            <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                {...register('newpassword', { 
                    required: 'new password is required',
                    pattern: {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                        message: 'New Password does not meet complexity requirements'
                    },
                    validate: (val: string) => {
                        if (watch('password') != val) {
                          return "Your passwords do no match";
                        }
                    }
                })}
                error={!!errors.newpassword}
                helperText={errors?.newpassword?.message as string}
            />
            <LoadingButton
                disabled={!isValid}
                loading={isSubmitting}
                type="submit"
                fullWidth
                variant="contained" sx={{ mt: 3, mb: 2 }}
            >
                Submit
            </LoadingButton>
        </Box>
    </Container>
    )
}