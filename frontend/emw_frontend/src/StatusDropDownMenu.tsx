import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseFormSetValue } from 'react-hook-form';

export default function SelectAutoWidth({ value, onChange } : { value: string, onChange: (value: string) => void }) {

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
    console.log("Selected value: ", event.target.value);
  };

//   React.useEffect(() => {
//     if (previousStatus) {
//       setStatus(previousStatus);
//       setValue("status", previousStatus, { shouldValidate: true });
//     }
//   }, []);

  return (
    <div>
      <FormControl sx={{  minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>
        <Select
        //   labelId="demo-simple-select-autowidth-label"
        //   id="demo-simple-select-autowidth"
          value={value}
          onChange={handleChange}
          autoWidth
          label="status"
        >
          <MenuItem value={"Ongoing"}>Ongoing</MenuItem>
          <MenuItem value={"Completed"}>Completed</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}