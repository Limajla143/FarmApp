import { Typography, Grid, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";

export default function AddressForm() {

  const { control, formState } = useFormContext();

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