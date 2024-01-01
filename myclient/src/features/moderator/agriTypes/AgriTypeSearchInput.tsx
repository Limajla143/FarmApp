import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/store/configStore";
import { useState } from "react";
import { setAgriTypeParams } from "./agriTypeSlice";

export default function AgriTypeSearchInput() {
    const {agrTypeParams} = useAppSelector(state => state.agritype);
    const [searchAgr, setSearchAgr] = useState(agrTypeParams.search);
    const dispatch = useAppDispatch();

    const debounceSearch = debounce((event: any) => {
        dispatch(setAgriTypeParams({search: event.target.value}));
    }, 1000 );
    
    return (
        <TextField label="Search Type" variant="outlined" fullWidth
        sx={{ backgroundColor: 'white', width: '500px'}}
        value={searchAgr || ''} onChange={(event: any) => {
            setSearchAgr(event.target.value);
            debounceSearch(event);
        }} />
    )
}