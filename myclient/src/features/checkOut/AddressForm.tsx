import { Typography, Grid, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import AppRadioButtonGroup from "../../app/components/AppRadioButton";
import { setDeliverPrice, updateDeliveryMethod } from "../basket/basketSlice";
import { useAppDispatch } from "../../app/store/configStore";

export default function AddressForm() {
  const dispatch = useAppDispatch();
  const { control, formState } = useFormContext();

  const [deliveryMethods, setDeliveryMethods] = useState<{value: string, label: string}[]>([]);
  const [deliverymethod, setDeliveryMethod] = useState<string>('');

  const [deliveryPrices, setDeliveryPrices] = useState<{deliveryId: number, price: number}[]>([]);

  const handleChangeDelivery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryMethod((event.target as HTMLInputElement).value);
    const deliveryP = deliveryPrices.find(price => price.deliveryId === Number((event.target as HTMLInputElement).value));

    dispatch(setDeliverPrice(deliveryP?.price));
    dispatch(updateDeliveryMethod(deliveryP?.deliveryId));
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
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} name="firstName" label="First Name" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="lastName" label="Last Name" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="street" label="Street" />
        </Grid>
        <Grid item xs={12} sm={6}>  
          <AppTextInput control={control} name="city" label="City" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="State" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="zipcode" label="Zipcode" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
              Delivery Time:
          </Typography>
            <AppRadioButtonGroup options={deliveryMethods} selectedValue={deliverymethod} name='deliveryMethodId'
                onChange={handleChangeDelivery} horizontal={true}/>    
        </Grid>
        <Grid item xs={12}>
        <AppCheckbox
          disabled={!formState.isDirty}
          name='saveAddress'
          label='Save this as the default address'
          control={control}
        />
        </Grid>
      </Grid>
      <Button type="submit">Submit</Button>
    </>
  );
}