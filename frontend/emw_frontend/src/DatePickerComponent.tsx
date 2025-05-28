import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';

export default function DatePickerComponent({label, name, control, error }:{label:string, name:string, control : any , error?:string}) {

    // const [dateValue, setDateValue] = React.useState<Dayjs | null>(dayjs( Date.now()));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <DatePicker
              label={label}
              value={field.value ? dayjs(field.value) : dayjs(Date.now())}
              onChange={(date) => field.onChange(date?.toDate() ?? null)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}
      />
    </LocalizationProvider>
  )
}
