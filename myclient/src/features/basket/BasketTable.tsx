import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { currencyFormat } from "../../app/utility/utils";

interface Props {
    items: BasketItem[];
    isBasket?: boolean;
}

export default function BasketTable({items, isBasket = true}: Props) {

    const {status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    
    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    {isBasket && 
                    <TableCell align="right"></TableCell> }
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map(item => (
                    <TableRow
                        key={item.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            <Box display='flex' alignItems='center'>
                                <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                                <span>{item.name}</span>
                            </Box>
                        </TableCell>
                        <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                        <TableCell align="center">
                        {isBasket && 
                            <LoadingButton 
                                loading={status === 'pendingRemoveItem' + item.id + 'rem'} 
                                onClick={() => dispatch(removeBasketItemAsync({productId: item.id, quantity: 1, name: 'rem'}))}  color='error'> 
                                <Remove />
                            </LoadingButton> }
                                {item.quantity}
                                {isBasket && 
                                <LoadingButton loading={status === 'pendingAddItem' + item.id} 
                                onClick={() => dispatch(addBasketItemAsync({productId: item.id}))} color='secondary'>
                                <Add />
                             </LoadingButton>}
                        </TableCell>
                        <TableCell align="right">{currencyFormat((item.price) * item.quantity)}</TableCell>
                        {isBasket && 
                        <TableCell>
                            <LoadingButton 
                             loading={status === 'pendingRemoveItem' + item.id + 'del'} 
                             onClick={() => dispatch(removeBasketItemAsync({productId: item.id, quantity: item.quantity, name: 'del'}))}  color='error'>
                                <Delete />
                            </LoadingButton>
                        </TableCell> }
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}