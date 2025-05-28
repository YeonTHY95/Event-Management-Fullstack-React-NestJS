import React from 'react';
import { Box, Stack } from '@mui/material';
import { useNavigate } from "react-router";
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button , TextField} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DatePickerComponent from './DatePickerComponent';
import UploadFileComponent from './UploadFileComponent';
import dayjs, { Dayjs } from 'dayjs';


type AddEventFormData = {
    eventName: string;
    startDate: Date ;
    endDate: Date ;   
    location: string;
    thumbnail: File;
};



const addEventSchema = z.object({
    eventName: z.string().min(1, "Event name is required"), 
    startDate: z.date({required_error: "Start date is required" }),
    endDate: z.date({required_error: "End date is required" }),
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
    const { register, handleSubmit, setValue , control, watch, formState: { errors } } = useForm<addEventZod>({
        resolver: zodResolver(addEventSchema),
    });

    const addEventAction:SubmitHandler<addEventZod> = async (formData:AddEventFormData) => {

        console.log("Form submitted:", formData);
        const form = new FormData();
        form.append("eventName", formData.eventName);
        form.append("startDate", formData.startDate.toISOString());
        // form.append("endDate", formData.endDate.toISOString());
        // form.append("location", formData.location);
        // form.append("thumbnail", formData.thumbnail);

        try {
            console.log("Inside addEventAction with formData: ", form);
            // console.log("Thumbnail value:", formData.thumbnail);
            const response = await axios.post("http://localhost:8000/event/add", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            console.log("Event added successfully:", response.data);
            navigate("/userview");
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    
  return (
    <Box sx={{ padding: 2 }}>
        <h1>Add Event</h1>
        <Box>
            <form onSubmit={handleSubmit(addEventAction)} >
                <Box>
                    <Stack direction="column" spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "left",
                    }}>
                        <TextField placeholder="Event Name" label="Event Name" error={!!errors.eventName} helperText={errors.eventName?.message} {...register("eventName")} />
                        {/* <Controller
                            control={control}
                            name="startDate"
                            render={({ field }) => (
                                <DatePickerComponent label={"Start Date"} value={field.value ? dayjs(field.value) : dayjs( Date.now())} />
                            )}
                        /> */}
                        <DatePickerComponent 
                            label="Start Date" 
                            name="startDate" 
                            control={control} 
                            error={errors.startDate?.message}
                        />
                        <DatePickerComponent 
                            label="End Date" 
                            name="endDate" 
                            control={control} 
                            error={errors.endDate?.message}
                        />
                        <TextField placeholder="Location" label="Location" error={!!errors.location} helperText={errors.location?.message} {...register("location")} />
                        <UploadFileComponent setValue={setValue} watch={watch} error={errors.thumbnail} />
                        {errors.thumbnail && <p style={{ color: "red" }}>{errors.thumbnail.message}</p>}
                    </Stack>
                </Box>
                <Button type="submit">Submit</Button>
            </form>
        </Box>
    </Box>
  )
}
