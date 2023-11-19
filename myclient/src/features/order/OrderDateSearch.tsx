import {  useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { Button,  TextField, debounce } from "@mui/material";
import { setOrderParams } from "./orderSlice";

export default function OrderDateSearch() {
    const {orderParams} = useAppSelector(state => state.order);
    const [dateFrom, setDateFrom] = useState(orderParams.dateFrom);
    const [dateTo, setDateTo] = useState(orderParams.dateTo);
    const dispatch = useAppDispatch();

    const debounceSearch = debounce(() => {
        dispatch(setOrderParams({dateFrom: dateFrom, dateTo: dateTo}))
    }, 1000 );

    const handleFromDateChange = (dateFrom: any) => {
        setDateFrom(dateFrom);
      };

    const handleToDateChange = (dateTo: any) => {
        setDateTo(dateTo);
      };

     

    return (
        <>
         <TextField  type="date" variant="outlined" sx={{ m: 2, width: '200px' }}  
             defaultValue='' onChange={(event) => handleFromDateChange(event.target.value)} label="Date From" focused/>
      
         <TextField type="date" variant="outlined" sx={{ m: 2, width: '200px' }}
             defaultValue='' onChange={(event) => handleToDateChange(event.target.value)} label="Date To" focused/>

          <Button onClick={debounceSearch} sx={{ m: 2 }} size='large' variant='contained'>Search</Button>
        </>       
    )
}