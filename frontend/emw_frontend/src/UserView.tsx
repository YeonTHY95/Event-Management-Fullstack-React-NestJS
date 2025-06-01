import React, {useContext} from 'react'
import { UserContext } from './UserContext';
import Box from '@mui/material/Box';
import { Stack, Button } from '@mui/material';
import { useNavigate } from "react-router";
import axios from 'axios';
import AdminPage from './AdminPage';
import NormalUserPage from './NormalUserPage';
import type {loginUserType} from './UserContext';
import axiosWithCredentials from './axiosWithCredentials';
import axiosWithLocalStorage from './axiosWithLocalStorage';

export default function UserView() {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const upgradeToAdmin = async (user: loginUserType | null) => {
        try {

            if (!user || user.isAdmin) {
                console.error("User is either null or already an admin");
                return;
            }
            // const upgradeAction = await axiosWithCredentials.patch("http://localhost:8000/user/upgrade", { userId: user.id });
            const upgradeAction = await axiosWithLocalStorage.patch("http://localhost:8000/user/upgrade", { userId: user.id });
            // Assuming the response contains the updated user data
            if (upgradeAction.status === 200) {
                console.log("Upgrade to Admin successful");
                setUser({ ...user, isAdmin: true }); 
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error deleting event:", error.message);
                alert(error.response?.data?.message || "An error occurred while deleting the event.");
                
                if (error.response?.status === 401 && error.response?.data?.message === "Failed to refresh tokens") {
                  // Handle unauthorized access, e.g., redirect to login
                  navigate("/");
                }
                
              } 
            console.error("Upgrade to Admin error: ", error);
            // Handle error, e.g., show a notification or alert
        }
    };

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
            <p>Role : { user?.isAdmin ? "Admin" : <span>User <Button variant="contained" color="primary" onClick={()=>upgradeToAdmin(user)}>Upgrade to Admin</Button></span> } </p>
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
