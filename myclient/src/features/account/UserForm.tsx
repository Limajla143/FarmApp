import { yupResolver } from "@hookform/resolvers/yup";
import { UserToComplete } from "../../app/models/UserProfile";
import { FieldValues, useForm } from "react-hook-form";
import { userValidation } from "./userValidation";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import AppDropzone from "../../app/components/AppDropzone";
import AppSelectList from "../../app/components/AppSelectList";
import AppTextInput from "../../app/components/AppTextInput";
import { useAppDispatch} from "../../app/store/configStore";
import {  signOut } from "./accountSlice";
import { clearBasket } from "../basket/basketSlice";

const genderOptions = ['Male', 'Female'];

export default function UserForm() {
    const {email} = useParams<{email: string}>();

    const { control, reset, handleSubmit, watch, formState: { isDirty, isSubmitting, isValid } } = useForm({
        resolver: yupResolver<any>(userValidation)
    });
    
    const watchFile = watch('file', null);
    const [userDetails, setUserDetails] = useState<UserToComplete>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {

        const getUser = async () => {
            await agent.Account.getUserByUser(email!).then(response => {
                setUserDetails(response);
              }).catch(error => {
                toast.error(error);
              });
          };
      
          getUser();

        if (userDetails && !watchFile && !isDirty) {
            reset(userDetails);
        } 
        return () => {
            if (watchFile) URL.revokeObjectURL(watchFile.preview);
        }
    }, [email, userDetails, reset, isDirty, watchFile])

    async function handleSubmitData(data: FieldValues) {
        await agent.Account.updateUser(data).then((response) => {
            if(response.statusCode == 200) {
                toast.success(response.message);
                dispatch(signOut());
                dispatch(clearBasket());
                navigate('/login');
            }
        })
        .catch((error) => {
            toast.error(error.message);
        });
    }
    
    return (
        <Box component={Paper} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Please complete you details to proceed ordering.
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='email' label='Email' disabled defaultValue={email}/>
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
                                <img src={userDetails?.photo} alt={userDetails?.userName} style={{ maxHeight: 200 }} />
                                )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='mobileNumber' label='Contact #' />
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
                    <LoadingButton loading={isSubmitting} type='submit' variant='contained' color='success' disabled={!isValid}>Submit</LoadingButton>
                </Box>
            </form>
        </Box>
    )
}