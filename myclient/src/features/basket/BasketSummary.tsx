import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { currencyFormat } from "../../app/utility/utils";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import AppRadioButtonGroup from "../../app/components/AppRadioButton";
import { deliveryMethodBasketAsync } from "./basketSlice";

interface Props {
    subtotal?: number;
    toSetDelivery?: boolean;
}

export default function BasketSummary({subtotal, toSetDelivery = true}: Props) {
    const dispatch = useAppDispatch();
    const { basket } = useAppSelector(state => state.basket)

    const [deliveryMethods, setDeliveryMethods] = useState<{value: string, label: string}[]>([]);
    const [deliverymethod, setDeliveryMethod] = useState<string>('');

    const [deliveryPrices, setDeliveryPrices] = useState<{deliveryId: number, price: number}[]>([]);

    
    if(subtotal === undefined){
        subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0;
    }

    let deliveryFee = 0.00;
    if(basket?.shippingPrice) {
        deliveryFee = basket.shippingPrice;
    }

  const handleChangeDelivery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryMethod((event.target as HTMLInputElement).value);
    const deliveryP = deliveryPrices.find(price => price.deliveryId === Number((event.target as HTMLInputElement).value));

    dispatch(deliveryMethodBasketAsync({deliveryMethodId: deliveryP?.deliveryId!}));
  };
 
  useEffect(() => {
      agent.Orders.getdeliverMethods()
        .then(response => {
          const newDeliveryMethods = response.map((option: any) => ({
            value: option.id,
            label: option.shortName + ' (' + option.deliveryTime + ')',
          }));

         const newDeliveryPrices = response.map((p: any) => ({
           deliveryId: p.id,
           price: p.price
         })); 
          setDeliveryMethods(newDeliveryMethods);
          setDeliveryPrices(newDeliveryPrices);
        }).catch(error => {
          toast.error(error);
        })
  }, []);

    return (
        <>
          { toSetDelivery ? ( <>
            <Typography variant="h6" gutterBottom>
              Delivery Time:
          </Typography>
            <AppRadioButtonGroup options={deliveryMethods} selectedValue={deliverymethod} name='deliveryMethodId'
                onChange={handleChangeDelivery} horizontal={true} />
          </>) : (<></>)}
        

            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Sub-Total: </TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery Fee: </TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total: </TableCell>
                            <TableCell align="right">{ currencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}