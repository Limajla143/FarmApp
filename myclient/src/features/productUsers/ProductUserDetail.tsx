import { Grid, Typography, Divider, TableContainer, Table, TableBody, TableRow, TableCell, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { fetchProductUserAsync, productUsersSelectors } from "./productUsersSlice";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/Loading";
import NotFound from "../../app/errors/NotFound";

export default function ProductUserDetail() {
    const dispatch = useAppDispatch();
    const {id} = useParams<{id: string}>();
    const product = useAppSelector(state => productUsersSelectors.selectById(state, id!));
    const {status: productStatus} = useAppSelector(state => state.productUsers);

    useEffect(() => {
        if(!product && id)
            dispatch(fetchProductUserAsync(parseInt(id)));     
    }, [id, dispatch, product])

    if (productStatus.includes('pendingFetchProductUser')) return <LoadingComponent message="Loading product..." />
    if (!product) return <NotFound />
    
    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{mb: 2}} />
                <Typography variant='h4' color='secondary'>${(product.price).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.agriType}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer> 
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField variant="outlined" type='number' label='Quantity in Cart' 
                        fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            sx={{height: '55px'}}
                            color="primary" 
                            size='large'
                            variant="contained"
                            fullWidth
                        >
                           Add Item
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}