import { Checkbox, FormControlLabel } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
}

export default function AppCheckbox(props: Props) {
    const { fieldState, field } = useController({...props, defaultValue: false});

    return (
        <div>
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={field.value} 
              onChange={(e) => {
                field.onChange(e.target.checked); 
              }}
            />
          }
          label={props.label}
        />
            {fieldState.error && <span className="error">{fieldState.error.message}</span>}
        </div>
        
      );
}