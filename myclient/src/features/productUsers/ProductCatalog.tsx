import { FormGroup, Grid, Paper } from "@mui/material";
import useProductUsers from "../../app/hooks/useProductUsers";
import LoadingComponent from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import AppCheckBoxButtons from "../../app/components/AppCheckBoxButtons";
import { setPageNumber, setProductUsersParams } from "./productUsersSlice";
import AppPagination from "../../app/components/AppPagination";
import AppRadioButtonGroup from "../../app/components/AppRadioButton";
import ProductUsersList from "./ProductUsersList";
import ProductUserSearch from "./ProductUserSearch";

const sortOptions = [
    {value: 'priceDesc', label: 'Price - High to Low'},
    {value: 'priceAsc', label: 'Price - Low to High'}
]

export default function ProductCatalog() {
    const {productUsers, types, filterUsersLoaded, metaData} = useProductUsers();
    const { productUsersParams } = useAppSelector(state => state.productUsers);
    const dispatch = useAppDispatch();

    if(!filterUsersLoaded) return <LoadingComponent message="Loading products users..."  />

    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb: 2}}>
                    <ProductUserSearch />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <AppRadioButtonGroup options={sortOptions}  selectedValue={productUsersParams.sort}
                        onChange={(e) => dispatch(setProductUsersParams({sort: e.target.value}))} />
                </Paper>

                <Paper sx={{mb: 2, p: 2}}>
                    <AppCheckBoxButtons items={types} checked={productUsersParams.types} 
                                    onChange={(items: string[]) => dispatch(setProductUsersParams({types: items}))} />
                </Paper>

            </Grid>
            <Grid item xs={9}>
                <ProductUsersList productUsers={productUsers}/>
            </Grid>

            <Grid item xs={9} sx={{mb: 2}}>
                {metaData && 
                    <AppPagination metaData={metaData} onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
                }
            </Grid>   
        </Grid>
    )
}