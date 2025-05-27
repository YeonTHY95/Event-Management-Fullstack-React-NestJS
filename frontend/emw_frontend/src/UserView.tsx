import React, {useContext} from 'react'
import { UserContext } from './UserContext';
import Box from '@mui/material/Box';
import { Stack, Button } from '@mui/material';
import { useNavigate } from "react-router";
import axios from 'axios';
import AdminPage from './AdminPage';
import NormalUserPage from './NormalUserPage';

export default function UserView() {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const logout = async () => {

        try {

            const logoutAction = await axios.post("http://localhost:8000/user/logout");
            // Clear user data and redirect to login or home page
            if (logoutAction.status === 201) {
                console.log("Logout successful");
                setUser(null);
                navigate("/");
            }
        } catch (error) {
            console.error("Logout error: ", error);
            
        }
    };

  return (
    <Box>
        <Box>
            <Stack direction="row" spacing={2} 
            sx={{
                justifyContent: "space-between",
                alignItems: "center",
            }}>
            <p>Role : { user?.isAdmin ? "Admin" : "User" }</p>
            <p>Email : { user?.email} </p>
            <Button onClick={logout} variant="contained" color="primary">
                Logout
            </Button>
            </Stack>
        </Box>
        <Box>
            { user?.isAdmin ? 
            <AdminPage /> :
            <NormalUserPage />
            }
        </Box>
    </Box>
  )
}
