import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink, useNavigate } from "react-router";
import axios from 'axios';
import { useContext } from 'react';
import EventTable from './EventTable';

export default function AdminPage() {


    const addEventAction = () => {

    }
  return (
    <Box>
        <Box sx={{ padding: 2 }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard. Here you can manage users, view reports, and perform administrative tasks.</p>
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
