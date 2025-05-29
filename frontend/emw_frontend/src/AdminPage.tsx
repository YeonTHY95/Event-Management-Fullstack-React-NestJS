import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink, useNavigate } from "react-router";
import axios from 'axios';
import { useContext } from 'react';
import EventTable from './EventTable';
import { useQuery } from '@tanstack/react-query';
import axiosWithCredentials from './axiosWithCredentials';

export default function AdminPage() {

  return (
    <Box>
        <Box sx={{ padding: 2 }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the Admin Dashboard. Here you can add, modify and delete event.</p>
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
