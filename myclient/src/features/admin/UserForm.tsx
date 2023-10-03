import { Controller, FieldValues, useForm } from "react-hook-form";
import { UserProfile } from "../../app/models/UserProfile"
import { useAppDispatch } from "../../app/store/configStore";
import { useEffect } from "react";
import agent from "../../app/api/agent";
import { getUserAdmin, setUserProfile } from "./adminSlice";
import { toast } from "react-toastify";
import { Box, Paper, Typography, Grid, Button, TextField } from "@mui/material";
import AppTextInput from "../../app/components/AppTextInput";
import AppSelectList from "../../app/components/AppSelectList";
import { userValidation } from "./userValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import {  LoadingButton } from "@mui/lab";
import { DatePicker, LocalizationProvider  } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Props {
    user?: UserProfile;
    cancelEdit: () => void;
}

const genderOptions = ['Male', 'Female'];

export default function UseForm({user, cancelEdit}: Props) {
    const { control, reset, handleSubmit, formState: { isDirty, isSubmitting } } = useForm({
        resolver: yupResolver<any>(userValidation)
    });
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user && !isDirty) reset(user);
        
    }, [user, reset, isDirty])

    async function handleSubmitData(data: FieldValues) {
        await agent.Admin.updateUserForAdmin(data).then(() => {
            dispatch(getUserAdmin(user?.id!));
        })
        .catch((error) => {
            toast.error(error.message);
        });
        //console.log(data);
        cancelEdit();
    }
    
    return (
        <Box component={Paper} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                User Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='email' label='Email' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='userName' label='Username' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller name='dateOfBirth' control={control} rules={{ required: true }}
                        render={({ field }) =>
                            <TextField type="date" {...field}  /> } />                   
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList control={control} items={genderOptions} name='gender' label='Gender' />
                    </Grid>
                    <Grid item xs={12}>

                    </Grid>
                    <Grid item xs={6}>
                        <AppTextInput control={control} name='addressDto.firstName' label='First Name' />
                    </Grid>
                    <Grid item xs={6}>
                        <AppTextInput control={control} name='addressDto.lastName' label='Last Name' />
                    </Grid>
                    <Grid item xs={6}>
                        <AppTextInput control={control} name='addressDto.street' label='Street' />
                    </Grid>
                    <Grid item xs={6}>
                        <AppTextInput control={control} name='addressDto.city' label='City' />
                    </Grid>
                    <Grid item xs={6}>
                        <AppTextInput control={control} name='addressDto.state' label='State' />
                    </Grid>
                    <Grid item xs={6}>
                        <AppTextInput control={control} name='addressDto.zipcode' label='Zip Code' />
                    </Grid>
                </Grid>
                <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
                    <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                    <LoadingButton loading={isSubmitting} type='submit' variant='contained' color='success'>Submit</LoadingButton>
                </Box>
            </form>
        </Box>
    )
}