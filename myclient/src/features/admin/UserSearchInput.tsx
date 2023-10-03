import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { TextField, debounce } from "@mui/material";
import { setUserProfileParams } from "./adminSlice";

export default function UserSearchInput() {
    const {userProfileParams} = useAppSelector(state => state.admin);
    const [searchAgr, setSearchAgr] = useState(userProfileParams.search);
    const dispatch = useAppDispatch();

    const debounceSearch = debounce((event: any) => {
        dispatch(setUserProfileParams ({search: event.target.value}))
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