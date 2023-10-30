import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { useAppSelector } from "../../app/store/configStore";
import { currencyFormat } from "../../app/utility/utils";

interface Props {
    subtotal?: number;
}

export default function BasketSummary({subtotal}: Props) {
    const { basket, deliveryPrice } = useAppSelector(state => state.basket)
    
    if(subtotal === undefined){
        subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0;
    }

    let deliveryFee = 0.00;
    if(deliveryPrice) {
        deliveryFee = deliveryPrice;
    }
    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Sub-Total: </TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery Fee: </TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total: </TableCell>
                            <TableCell align="right">{ currencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}