import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Container, Paper, Avatar, Typography, Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onTouched'
    });

    const navigate = useNavigate();

    function handleApiErrors(errors: any) {
        if (Array.isArray(errors)) {
            errors.forEach((error: string, index: number) => {
                 if (error.includes('useremail')) {
                    setError('useremail', { message: error })
                }
            });
        }
        else if (typeof errors === 'string') {
             if (errors.includes('useremail')) {
                setError('useremail', { message: errors });
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
            Forgot Password
        </Typography>
        <Box component="form"
            noValidate sx={{ mt: 1 }}
            onSubmit={handleSubmit(data => agent.Account.forgotPassword(data.useremail as string)
                .then((response) => {
                    if(response.statusCode == 200) {
                        toast.success(response.message); 
                        navigate('/');
                    }
                    else {
                        toast.error(response.message);
                    }
            })
            .catch(error => 
                handleApiErrors(error)           
            ))}
        >
            <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                {...register('useremail', { 
                    required: 'Email is required',
                    pattern: {
                        value: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
                        message: 'Not a valid email address'
                    }
                })}
                error={!!errors.useremail}
                helperText={errors?.useremail?.message as string}
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