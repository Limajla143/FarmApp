import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface Props {
    options: any[];
    onChange: (event: any) => void;
    selectedValue: string;
    name?: string;
    horizontal: boolean;
}

export default function AppRadioButtonGroup({options, onChange, selectedValue, name, horizontal} : Props) {
    return (
        <FormControl>
         <RadioGroup onChange={onChange} value={selectedValue} style={{ flexDirection: horizontal ? 'row' : 'column' }}>
                {options.map(({value, label}) => (
                    <FormControlLabel value={value} control={<Radio key={value} />} label={label} key={value} name={name} />
                ))}
            </RadioGroup>    
        </FormControl>
    )
}