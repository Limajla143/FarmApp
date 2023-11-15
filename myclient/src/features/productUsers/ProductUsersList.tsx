import { Grid } from "@mui/material";
import { ProductUsers } from "../../app/models/productUsers";
import { useAppSelector } from "../../app/store/configStore";
import ProductUserSkeleton from "./ProductUserSkeleton";
import ProductUserCard from "./ProductUserCard";

interface Props {
    productUsers: ProductUsers[];
}

export default function ProductUsersList({productUsers}: Props) {
    const { productUsersLoaded } = useAppSelector(state => state.productUsers);
    return (
        <Grid container spacing={4}>
        { productUsers.map(productUser => (
          <Grid item xs={4} key={productUser.id}> 
              {!productUsersLoaded? (
                  <ProductUserSkeleton />
              ) : (
                <ProductUserCard productUser={productUser} />
              )}
              
          </Grid>         
        ))}
      </Grid>

    )
}