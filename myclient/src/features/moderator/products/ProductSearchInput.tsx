import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configStore"
import { TextField, debounce } from "@mui/material";
import { setProductParams } from "./productSlice";

export default function ProductSearchInput() {
    const {productParams} = useAppSelector(state => state.product);
    const [searchPrd, setSearchPrd] = useState(productParams.search);
    const dispatch = useAppDispatch();

    const debounceSearch = debounce((event: any) => {
        dispatch(setProductParams({search: event.target.value}))
    }, 1000);

    return (
        <TextField label="Search Products" variant="outlined" fullWidth
            sx={{backgroundColor: 'white', width: '600px'}}
            value={searchPrd || ''} onChange={(event: any) => {
                setSearchPrd(event.target.value);
                debounceSearch(event);
            }}
        />
    )
}