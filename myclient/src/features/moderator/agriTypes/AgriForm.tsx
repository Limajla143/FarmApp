
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../../app/store/configStore";
import { setAgriType } from "./agriTypeSlice";
import { useEffect } from "react";
import {  FieldValues, useForm } from "react-hook-form";
import { AgriType } from "../../../app/models/agriType";
import { yupResolver } from '@hookform/resolvers/yup';
import { agriTypeSchema } from "./agriTypeValidation";
import agent from "../../../app/api/agent";
import AppTextInput from "../../../app/components/AppTextInput";

interface Props {
    agriType?: AgriType;
    cancelEdit: () => void;
}

export default function AgriTypeForm({agriType, cancelEdit} : Props) {
    const { control, reset, handleSubmit, formState: { isDirty, isSubmitting } } = useForm({
        resolver: yupResolver<any>(agriTypeSchema)
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(agriType && !isDirty) {
            reset(agriType);
        }
    }, [agriType, reset, isDirty])

    async function submitAgriType(data: FieldValues) {
        try {           
            const response = await agent.AgriTypes.addUpdateAgriType(data);
            dispatch(setAgriType(response));
            cancelEdit();
        } catch (error) {
            console.log(error);
        }
    }

    console.log(agriType);
    
    return (
        <Box component={Paper} sx={{ p: 4}}>
            <Typography variant="h4" gutterBottom sx={{mb: 4}}>
                 AgriType 
            </Typography>
        <form onSubmit={handleSubmit(submitAgriType)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                 <AppTextInput control={control} name="name" label="Agritype Name" />
               </Grid>  
            </Grid>
            
            <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
                    <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                    <LoadingButton loading={isSubmitting} type='submit' variant='contained' color='success'>Submit</LoadingButton>
            </Box>
        </form>
        </Box>
    );
}