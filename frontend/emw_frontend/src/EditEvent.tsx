import React from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from "react-router";
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button , TextField, Box, Stack, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

// import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DatePickerComponent from './DatePickerComponent';
import UploadFileComponent from './UploadFileComponent';
import dayjs, { Dayjs } from 'dayjs';
import axiosWithCredentials from './axiosWithCredentials';
import StatusDropDownMenu from './StatusDropDownMenu';
import axiosWithLocalStorage from './axiosWithLocalStorage';


export type EditEventFormData = {
    eventID: number;
    eventName: string;
    startDate: Date ;
    endDate: Date ;   
    location: string;
    thumbnail: File;
    status: string;
};


export default function EditEvent() {

    const location = useLocation();
    const eventData = location.state?.eventData;
    console.log("EditEvent - eventData: ", eventData);

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const addEventSchema = z.object({
        eventID: z.number( {message: "event ID is required"}), 
        eventName: z.string().min(1, "Event name is required"), 
        startDate: z.date({required_error: "Start date is required" }),
        endDate: z.date({required_error: "End date is required" }),
        location: z.string().min(1, "Location is required"),
        status: z.string().min(1, "Status is required"),
        thumbnail: z.instanceof(File).refine(file => file.size > 0, {
            message: "Thumbnail is required",
        }),
    }).refine((data) => data.startDate <= data.endDate, {
        message: "Start date must be before end date",
        path: ["endDate"],
        });
    
    type addEventZod = z.infer<typeof addEventSchema>;

    const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<addEventZod>({
        resolver: zodResolver(addEventSchema),
        defaultValues: {
            eventID: eventData?.id ,
            eventName: eventData?.name ,
            startDate: new Date(eventData.startDate) ,
            endDate: new Date(eventData?.endDate) ,
            location: eventData?.location ,
            status: eventData?.status ,
            thumbnail: eventData.thumbnail,
        }
        
    }); 

    function base64ToUint8Array(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
    
    function uint8ArrayToFile(data: Uint8Array, fileName: string, mimeType: string): File {
        const blob = new Blob([data], { type: mimeType });
        return new File([blob], fileName, { type: mimeType });
    }
    // Assume eventData.thumbnail is base64-encoded
    const base64Data = eventData.thumbnail.split(',')[1]; // remove 'data:image/jpeg;base64,'
    const uint8Array = base64ToUint8Array(base64Data);
    const file = uint8ArrayToFile(uint8Array, "thumbnail.jpg", eventData.mimeType);

        
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

    useEffect(() => {
        async function setThumbnailFromBase64() {
          if (eventData?.thumbnail?.startsWith("data:image")) {
            const res = await fetch(eventData.thumbnail);
            const blob = await res.blob();
            const file = new File([blob], "thumbnail.jpg", { type: blob.type });
            setValue("thumbnail", file);
          }
        }
        setThumbnailFromBase64();
      }, []);

    const editEventAction:SubmitHandler<addEventZod> = async (formData:EditEventFormData) => {

        console.log("Form submitted:", formData);
        const form = new FormData();
        form.append("eventID", formData.eventID.toString());
        form.append("eventName", formData.eventName);
        form.append("startDate", formData.startDate.toISOString());
        form.append("endDate", formData.endDate.toISOString());
        form.append("location", formData.location);
        form.append("status", formData.status);
        form.append("thumbnail", formData.thumbnail);
        form.append("ownerId", user?.id?.toString() || ""); // Ensure ownerId is a string

        try {
            console.log("Inside Edit EventAction with form: ", form);
            // console.log("Thumbnail value:", formData.thumbnail);
            // const response = await axiosWithCredentials.patch("http://localhost:8000/event/update", form, {
            const response = await axiosWithLocalStorage.patch("http://localhost:8000/event/update", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            console.log("Event added successfully:", response.data);
            navigate("/userview");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error deleting event:", error.message);
                alert(error.response?.data?.message || "An error occurred while deleting the event.");
                
                if (error.response?.status === 401 && error.response?.data?.message === "Failed to refresh tokens") {
                  // Handle unauthorized access, e.g., redirect to login
                  navigate("/");
                }
                
              } 
            console.error("Error adding event:", error);
        }
    };

  return (
    <div>
        <Box sx={{ marginBottom: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => navigate("/userview")}>
                        Back
                    </Button>
                </Box>
        <h1>Edit Event</h1>
        <Box sx={{ padding: 2 }}>
        <Box>
            <form onSubmit={handleSubmit(editEventAction)} >
                <input type='hidden' value={eventData?.id} name="eventID" />
                <Box>
                    <Stack direction="column" spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "left",
                    }}>
                        <TextField placeholder="Event Name" label="Event Name"  error={!!errors.eventName} helperText={errors.eventName?.message}  {...register("eventName")} /> 
                        
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
                        <TextField placeholder="Location" label="Location" helperText={errors.location?.message} error={!!errors.location} {...register("location")} />
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <StatusDropDownMenu
                                    value = {field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        
                        {/* <StatusDropDownMenu setValue={setValue} previousStatus = {eventData?.status}  /> */}
                        <UploadFileComponent setValue={setValue} watch={watch} error={errors.thumbnail} previousFile={file}/>
                    </Stack>
                </Box>
                <Button type="submit">Submit</Button>
            </form>
        </Box>
    </Box>
    </div>
  )
}
