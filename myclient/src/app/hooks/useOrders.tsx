import { useEffect } from "react";
import { getOrdersAsync, ordersSelectors } from "../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../store/configStore";

export default function useOrders() {
    const orders = useAppSelector(ordersSelectors.selectAll);
    const {ordersLoaded, metaData} = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!ordersLoaded) dispatch(getOrdersAsync());
    }, [ordersLoaded, dispatch])

    return {
        orders, ordersLoaded, metaData
    }
}