import React from 'react';
import { Box, Stack } from '@mui/material';
import { useNavigate } from "react-router";
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button , TextField} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



type AddEventFormData = {
    eventName: string;
    startDate: Date | null;
    endDate: Date | null;   
    location: string;
    thumbnail: File;
};



const addEventSchema = z.object({
    eventName: z.string().min(1, "Event name is required"), 
    startDate: z.date().nullable().refine(date => date !== null, {
        message: "Start date is required",
    }),
    endDate: z.date().nullable().refine(date => date !== null, {
        message: "End date is required",
    }),
    location: z.string().min(1, "Location is required"),
    thumbnail: z.instanceof(File).refine(file => file.size > 0, {
        message: "Thumbnail is required",
    }),
});

type addEventZod = z.infer<typeof addEventSchema>;

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function AddEvent() {

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(addEventSchema),
    });

    const addEventAction:SubmitHandler<addEventZod> = async (formData:AddEventFormData) => {
        try {
            const response = await axios.post("http://localhost:8000/event/add", formData, {
                headers: {
                    withCredentials: true,
                }
            });
            console.log("Event added successfully:", response.data);
            navigate("/userview");
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const [startDateValue, setStartDateValue] = React.useState<Dayjs | null>(null);
    const [endDateValue, setEndDateValue] = React.useState<Dayjs | null>(null);
  return (
    <Box sx={{ padding: 2 }}>
        <h1>Add Event</h1>
        <Box>
            <form onSubmit={handleSubmit(addEventAction)} >
                <Box>
                    <Stack direction="row" spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <TextField placeholder="Event Name" label="Event Name" error={!!errors.eventName} helperText={errors.eventName?.message} {...register("eventName")} />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                <DatePicker
                                label="Start Date"
                                value={startDateValue}
                                onChange={(newValue) => setStartDateValue(newValue)}
                                />
                            </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                <DatePicker
                                label="End Date"
                                value={endDateValue}
                                onChange={(newValue) => setEndDateValue(newValue)}
                                />
                            </DemoContainer>
                            </LocalizationProvider>
                        <TextField placeholder="Location" label="Location" error={!!errors.location} helperText={errors.location?.message} {...register("location")} />
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            >
                            Upload files
                            <VisuallyHiddenInput
                                type="file"
                                onChange={(event) => console.log(event.target.files)}
                                multiple
                            />
                        </Button>
                    </Stack>
                </Box>
                <Button type="submit">Add Event</Button>
            </form>
        </Box>
    </Box>
  )
}
