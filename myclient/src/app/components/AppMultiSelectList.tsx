import { FormControl, InputLabel, MenuItem, Checkbox, ListItemText  } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
    options: string[];
}

export default function AppMultiSelectList(props: Props) {
    const { fieldState, field } = useController({ ...props, defaultValue: [] });

    const handleChange = (
        event: SelectChangeEvent<string[]>
      ) => {
        field.onChange(event.target.value); // Ensure the correct type here
      };
    
    return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel id={`multi-select-label-${props.name}`}>{props.label}</InputLabel>
      <Select
        labelId={`multi-select-label-${props.name}`}
        id={`multi-select-${props.name}`}
        multiple
        value={field.value}
        onChange={handleChange}
        inputProps={{ name: props.name }}
        renderValue={(selected) => selected.join(', ')}
      >
        {props.options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={field.value.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
      {fieldState.error && <span className="error">{fieldState.error.message}</span>}
    </FormControl>
    );
}