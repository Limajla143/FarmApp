import { useEffect } from "react";
import { fetchFilters, fetchProductUsersAsync, productUsersSelectors } from "../../features/productUsers/productUsersSlice";
import { useAppDispatch, useAppSelector } from "../store/configStore"

export default function useProductUsers() {
    const productUsers = useAppSelector(productUsersSelectors.selectAll);
    const {productUsersLoaded, filterUsersLoaded, types, metaData} = useAppSelector(state => state.productUsers);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!productUsersLoaded)
            dispatch(fetchProductUsersAsync());
    }, [productUsersLoaded, dispatch, filterUsersLoaded])

    useEffect(() => {
        if(!filterUsersLoaded)
            dispatch(fetchFilters());
    }, [dispatch, filterUsersLoaded])

    return {
        productUsers, productUsersLoaded, filterUsersLoaded, types, metaData
    }
}