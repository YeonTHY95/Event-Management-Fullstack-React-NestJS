import { Button, Stack } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

export default function EventDetail() {

    const location = useLocation();
    const navigate = useNavigate();
    const eventData = location.state?.eventData;
    console.log("EventDetail - eventData: ", eventData);

  return (
    <Stack>
        <Button variant="contained" color="primary" fullWidth={false} style={{width:"20px"}} onClick={() => navigate("/userview")}>
            Back
        </Button>
        <h1>{eventData?.name}</h1>
        {/* <p>Event ID: {eventData?.id}</p> */}
        <p>Start Date: {eventData?.startDate.split("T")[0]}</p>
        <p>End Date: {eventData?.endDate.split("T")[0]}</p>
        <p>Status: {eventData?.status}</p>
        <p>Location: {eventData?.location}</p>
        <img src={eventData?.thumbnail} alt={eventData?.name} style={{ width: '300px', height: 'auto' }} />
    </Stack>
  )
}
