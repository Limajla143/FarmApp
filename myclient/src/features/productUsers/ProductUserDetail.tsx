import { Grid, Typography, Divider, TableContainer, Table, TableBody, TableRow, TableCell, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { fetchProductUserAsync, productUsersSelectors } from "./productUsersSlice";
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/Loading";
import NotFound from "../../app/errors/NotFound";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";

export default function ProductUserDetail() {
    const dispatch = useAppDispatch();
    const {id} = useParams<{id: string}>();
    const product = useAppSelector(state => productUsersSelectors.selectById(state, id!));
    const {status: productStatus} = useAppSelector(state => state.productUsers);
    const {basket, status} = useAppSelector(state => state.basket);
    const [quantity, setQuantity] = useState(0);
    const item = basket?.items.find(i => i.id === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        if(!product && id)
            dispatch(fetchProductUserAsync(parseInt(id)));     
    }, [id, dispatch, product])

    function handleInputCart(event: any) {
        if(event.target.value >= 0) {
         setQuantity(parseInt(event.target.value))
        }
     }
 
     function handleUpdateCart() {
         if (!item || quantity > item.quantity) {
             const updateQuantity = item ? quantity - item.quantity : quantity;
             dispatch(addBasketItemAsync({productId: product?.id!, quantity: updateQuantity}))
         }
         else {
            const updateQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updateQuantity}))
         }
     }

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
                        fullWidth value={quantity} onChange={handleInputCart}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            sx={{height: '55px'}}
                            color="primary" 
                            size='large'
                            variant="contained"
                            fullWidth
                            disabled={item?.quantity === quantity}
                            loading={status.includes('pending', item?.id)}
                            onClick={handleUpdateCart}
                        >
                           Add Item
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}