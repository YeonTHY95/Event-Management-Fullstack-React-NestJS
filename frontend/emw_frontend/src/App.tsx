// import './App.css'
import { useForm } from "react-hook-form"
import { TextField, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { NavLink, useNavigate } from "react-router";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useContext } from 'react';
import { UserContext } from "./UserContext";


export type userType = {
  email: string | null;
  password: string | null;
  name?: string | null;
  role: "user" | "admin" | null;
}

function App() {

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors  },
  } = useForm<loginField>();

  type loginField = {
    email: string;
    password: string;
  }

  const navigate = useNavigate();

  const {setUser} = useContext(UserContext); // Assuming you have a UserContext set up
  
  // const UserContext = createContext<{
  //   user: userType | null;
  //   setUser: Dispatch<SetStateAction<userType>>;
  // }>({
  //   user: null,
  //   setUser: () => {},
  // });

  // const [user, setUser] = useState({userId: null, role:null, isAuthenticated: false});
  
  const tanStackMutation = useMutation({
    mutationFn: async (data: loginField) => {
      try {
        const loginResponse = await axios.post("http://localhost:8000/user/login", data);
        return loginResponse.data; 
      } 
      catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data.message || "An error occurred";
          console.error("Login error Message: ", errorMessage);
          // setError("root", { message: errorMessage });
          throw new Error(errorMessage); // rethrow the error to be caught in onError
        }
        else {
          console.log("An unexpected error occurred during login : ", error);
          throw new Error("An unexpected error occurred during login");
        }
      }
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // setUser({...user, email: data.user.email, role: data.user.isAdmin ? "admin" : "user", name: data.user.name || null, password : data.user.password}); 
      setUser(data.user);
      reset();
      navigate("/userview");
      // Handle successful login, e.g., redirect or show a success message
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
      setError("root", { message: error.message });
      // setError("email", { type: "manual", message: error.message });
    }
  });

  const handleLogin = (data: loginField) => {
    tanStackMutation.mutate(data);
  };

  return (
    <>
      <h1>Login Page</h1>
      <p style={{color:"red", fontSize:"20px"}}>{ errors.root && errors.root.message}</p>
      <form onSubmit={handleSubmit(handleLogin)}>
        <Stack direction="column" spacing={2}>
          <TextField placeholder="Email" label="Email" error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
          <TextField placeholder="Password" label="Password" type="password" error={!!errors.password} helperText={errors.password?.message} {...register("password")} />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Stack>
      </form>
      <p><NavLink to='/signup'>Create new Account</NavLink></p>
    </>
  )
}

export default App
