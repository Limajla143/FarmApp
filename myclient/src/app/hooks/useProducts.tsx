import { useEffect } from "react";
import { fetchFilters, getProductsAsync, productsSelectors } from "../../features/moderator/products/productSlice";
import { useAppDispatch, useAppSelector } from "../store/configStore";

export default function useProducts() {
    const products = useAppSelector(productsSelectors.selectAll);
    const {productsLoaded, filterLoaded, agritypes, metaData} = useAppSelector(state => state.product);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!productsLoaded) dispatch(getProductsAsync());
    }, [productsLoaded, dispatch, filterLoaded])

    useEffect(() => {
      if(!filterLoaded) dispatch(fetchFilters()); 
    }, [dispatch, filterLoaded])

    return {
        products, productsLoaded, filterLoaded, agritypes, metaData
    }

}