import { FieldValues, useForm } from "react-hook-form";
import { Product } from "../../../app/models/product";
import useProducts from "../../../app/hooks/useProducts";
import { useAppDispatch } from "../../../app/store/configStore";
import { useEffect } from "react";
import agent from "../../../app/api/agent";
import { setProduct } from "./productSlice";
import { toast } from "react-toastify";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AppTextInput from "../../../app/components/AppTextInput";
import AppDropzone from "../../../app/components/AppDropzone";
import AppSelectList from "../../../app/components/AppSelectList";
import { yupResolver } from "@hookform/resolvers/yup";
import { prodValidationSchema } from "./productValidation";
import { fetchProductUsersAsync } from "../../productUsers/productUsersSlice";

interface Props {
    product?: Product;
    cancelEdit: () => void;
}

export default function ProductForm({product, cancelEdit}: Props) {
    const { control, reset, handleSubmit, watch, formState: { isDirty, isSubmitting } } = useForm({
        resolver: yupResolver<any>(prodValidationSchema)
    });
    
    const { agritypes } = useProducts();
    const watchFile = watch('file', null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (product && !watchFile && !isDirty) reset(product);
        return () => {
            if (watchFile) URL.revokeObjectURL(watchFile.preview);
        }
    }, [product, reset, watchFile, isDirty])

    async function handleSubmitData(data: FieldValues) {
        await agent.Products.addUpdateProduct(data).then((response) => {
            dispatch(setProduct(response));
            dispatch(fetchProductUsersAsync());
        }).catch((error) => {
            toast.error(error);
        });
       
        cancelEdit();
    }

    return (
        <Box component={Paper} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <AppTextInput control={control} name='name' label='Product name' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList control={control} items={agritypes} name='agriType' label='Type' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput type='number' control={control} name='price' label='Price' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput type='number' control={control} name='salesTax' label='Tax' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput type='number' control={control} name='quantity' label='Quantity in Stock' />
                    </Grid>
                    <Grid item xs={12}>
                        <AppTextInput control={control} multiline={true} rows={4} name='description' label='Description' />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <AppDropzone control={control} name='file' />
                            {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{ maxHeight: 200 }} />
                            ) : (
                                <img src={product?.pictureUrl} alt={product?.name} style={{ maxHeight: 200 }} />
                            )}
                        </Box>

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