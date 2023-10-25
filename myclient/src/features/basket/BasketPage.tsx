import { Typography, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configStore";
import BasketTable from "./BasketTable";
import BasketSummary from "./BasketSummary";

export default function BasketPage() {
    const {basket} = useAppSelector(state => state.basket);

    if (!basket) return <Typography variant="h3">Your basket is empty...</Typography>

    return (
        <>
        <BasketTable items={basket.items} />
        <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
            <BasketSummary />
            <Button component={Link} to='/checkout'
            variant='contained' size='large' fullWidth
            >
                Check Out
            </Button>
        </Grid>
    </Grid>
    </>  
    )
}