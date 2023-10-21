import { LoadingButton } from "@mui/lab";
import { Card, CardHeader, Avatar, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ProductUsers } from "../../app/models/productUsers"
import { useAppDispatch } from "../../app/store/configStore";
import { currencyFormat } from "../../app/utility/utils";

interface Props {
    productUser: ProductUsers
}


export default function ProductUserCard({productUser} : Props){
    const dispatch = useAppDispatch();
    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {productUser.name.charAt(0).toUpperCase() }
                    </Avatar>
                }
                title={productUser.name}
                titleTypographyProps={{
                    sx: {fontWeight: 'bold', color: 'secondary'}
                }}
            ></CardHeader>
        <CardMedia
          sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
          image={productUser.pictureUrl}
          title={productUser.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
                {currencyFormat(productUser.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {productUser.agriType}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton size="small">Add to Cart</LoadingButton>
          <Button component={Link} to={`/products/${productUser.id}`}>View</Button>
        </CardActions>
      </Card>
    )
}