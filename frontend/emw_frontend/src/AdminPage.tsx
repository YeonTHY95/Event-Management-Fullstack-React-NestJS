import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink, useNavigate } from "react-router";
import axios from 'axios';
import { useContext } from 'react';
import EventTable from './EventTable';
import { useQuery } from '@tanstack/react-query';
import axiosWithCredentials from './axiosWithCredentials';

export default function AdminPage() {


    // const { data, isPending, error} = useQuery({
    //       queryKey: ['events'],
    //       queryFn: async () => {
    //         const response = await axiosWithCredentials.get('http://localhost:8000/event/getAllEvents');
    //         if (!response) {
    //           throw new Error('Network response was not ok');
    //         }

    //         console.log("Response from getAllEvents: ", response.data);
    //         // console.log("Response from data: ", data);
    //         return response.data;
    //       },
    //     });
  return (
    <Box>
        <Box sx={{ padding: 2 }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard. Here you can manage users, view reports, and perform administrative tasks.</p>
        </Box>
        <Box>
            {/* {
                data && data.length > 0 && (
                    <div>
                        <p>Total Events: {data.length}</p>
                        {
                            data.map((event:any) => (
                                <div key={event.id} style={{ marginBottom: '10px' }}>
                                    <h3>{event.eventName}</h3>
                                    <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
                                    <p>Location: {event.location}</p>
                                    <img src={event.thumbnail} alt={event.eventName} style={{ width: '100px', height: '100px' }} />
                                </div>
                            ))
                        }
                    </div>
                    
                ) 
            } */}
        </Box>
        <Box>
            <Button>
                <NavLink to="/add-event" style={{ textDecoration: 'none', color: 'inherit', border: '3px solid blue', padding: '10px', borderRadius: '5px' }}>
                    Add Event
                </NavLink>
            </Button>
        </Box>
        <Box sx={{ padding: 2 }}>
            <EventTable />  
        </Box>
    </Box>
  )
}
