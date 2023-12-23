import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { TextField, debounce } from "@mui/material";
import { setProductUsersParams } from "./productUsersSlice";

export default function ProductUserSearch() {
    const {productUsersParams} = useAppSelector(state => state.productUsers);
    const [search, setSearch] = useState(productUsersParams.search);
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductUsersParams({search: event.target.value}));
    }, 1000)

    return(
        <TextField 
            label='Search products'
            variant='outlined'
            fullWidth
            value={search|| ''}
            onChange={(event: any) => {
                setSearch(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
}