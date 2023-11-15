import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";
import OrderDetailed from "./OrderDetailed";
import { currencyFormat } from "../../app/utility/utils";
import useOrders from "../../app/hooks/useOrders";
import AppPagination from "../../app/components/AppPagination";
import { useAppDispatch } from "../../app/store/configStore";
import { removeOrder, setPageNumber } from "./orderSlice";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import OrderDateSearch from "./OrderDateSearch";

export default function Orders() {
    const {orders, metaData} = useOrders();
    const dispatch = useAppDispatch();
    
    const [loading, setLoading] = useState(false);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);
    const [target, setTarget] = useState(0);

    function handleDeleteOrder(id: number) {
        setLoading(true);
        setTarget(id);
        agent.Orders.removeOrder(id)
            .then(() => dispatch(removeOrder(id)))
            .catch(error => toast.error(error))
            .finally(() => setLoading(false));
    }

    if (selectedOrderNumber > 0) return (
        <OrderDetailed
            order={orders?.find(o => o.id === selectedOrderNumber)!}
            setSelectedOrder={setSelectedOrderNumber}
        />
    )

    return (
        <>
        <Box  sx={{marginBottom: 1}}>
                <Paper >
                    <OrderDateSearch />
                </Paper>
        </Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order Number</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Order Date</TableCell>
                        <TableCell align="right">Order Status</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((order) => (
                        <TableRow
                            key={order.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                        >
                            <TableCell component="th" scope="row">
                                {order.id}
                            </TableCell>
                            <TableCell align="right">{currencyFormat(order.total)}</TableCell>
                            <TableCell align="right">{order.orderDate.split('T')[0]}</TableCell>
                            <TableCell align="right">{order.orderStatus}</TableCell>
                            <TableCell align="right">
                                <Button onClick={() => setSelectedOrderNumber(order.id)}>
                                    View
                                </Button>
                                <LoadingButton 
                                   loading={loading && target === order.id} 
                                   onClick={() => handleDeleteOrder(order.id)} 
                                   startIcon={<Delete />} color='error' />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        {metaData && 
            <Box sx={{pt: 2}}>
                <AppPagination 
                    metaData={metaData} 
                    onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
            </Box>
        }       
        </>
    )
}