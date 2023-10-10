import { FieldValues, useForm } from "react-hook-form";
import { UserProfile } from "../../app/models/UserProfile"
import { useAppDispatch } from "../../app/store/configStore";
import { useEffect } from "react";
import agent from "../../app/api/agent";
import { getUserAdmin, getUsersAdmin } from "./adminSlice";
import { toast } from "react-toastify";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import AppTextInput from "../../app/components/AppTextInput";
import AppSelectList from "../../app/components/AppSelectList";
import { userValidation } from "./userValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import {  LoadingButton } from "@mui/lab";
import AppDropzone from "../../app/components/AppDropzone";
import AppCheckbox from "../../app/components/AppCheckbox";
import useUserProfiles from "../../app/hooks/useUserProfile";
import AppMultiSelectList from "../../app/components/AppMultiSelectList";

interface Props {
    user?: UserProfile;
    cancelEdit: () => void;
}

const genderOptions = ['Male', 'Female'];

export default function UseForm({user, cancelEdit}: Props) {
    const { control, reset, handleSubmit, watch, formState: { isDirty, isSubmitting } } = useForm({
        resolver: yupResolver<any>(userValidation)
    });
    
    const watchFile = watch('file', null);
    const dispatch = useAppDispatch();
    const {roles} = useUserProfiles();

    useEffect(() => {
        if (user && !watchFile && !isDirty) {
            reset(user);
        } 
        return () => {
            if (watchFile) URL.revokeObjectURL(watchFile.preview);
        }
    }, [user, reset, isDirty, watchFile])

    async function handleSubmitData(data: FieldValues) {
        await agent.Admin.updateUserForAdmin(data).then(() => {
            dispatch(getUsersAdmin());
        })
        .catch((error) => {
            toast.error(error.message);
        });
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
                        <AppTextInput control={control} type="date" name="dateOfBirth" label="Date of Birth" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList control={control} items={genderOptions} name='gender' label='Gender' />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <AppDropzone control={control} name='file' />
                                {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{ maxHeight: 200 }} />
                                ) : (
                                <img src={user?.photo} alt={user?.userName} style={{ maxHeight: 200 }} />
                                )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='mobileNumber' label='Contact #' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppMultiSelectList name='roles' label='Select Roles' control={control} options={roles} rules={{required: 'Please select at least one.'}} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppCheckbox control={control} name='isActive' label='Is Active' />
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