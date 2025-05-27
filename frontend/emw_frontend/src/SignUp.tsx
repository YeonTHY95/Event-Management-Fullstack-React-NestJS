import React from 'react';
import { useForm, type SubmitHandler } from "react-hook-form"
import { TextField } from '@mui/material';
import { useRadioGroup } from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';

import { useNavigate } from "react-router";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { Controller } from "react-hook-form";

import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';


export default function SignUp() {

    const navigate = useNavigate();

    type signUpField = {
        email: string;
        password: string;
        role : "user" | "admin";
    };

    const signUpSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(3, "Password must be at least 3 characters"),
        role: z.enum(["user", "admin"], {message: "Role must be either 'user' or 'admin'"}),
    });

    type zodSignUpField = z.infer<typeof signUpSchema>;

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors  },
        reset,
        control
    } = useForm<zodSignUpField>({
        resolver: zodResolver(signUpSchema),
    });

    const tanStackMutation = useMutation({
        mutationFn : async ( data : signUpField) => {
            // console.log("tanStackMutation Data is ", data);
            try {
                const signupResponse = await axios.post("http://localhost:8000/user/signup", data);
                return signupResponse.data; // return the response data
            }
            catch (error) {

                if (isAxiosError(error)) {
                    console.log("SignUp Error : ", error);
                    setError("root", {
                        message : error.message
                    });
                }
                else {
                    console.log("tanStackMutation Error : ", error);
                }
                
            }

        },
        onSuccess : (data) => {
            console.log("Signup success:", data);
            reset(); // clear form
            navigate("/"); // redirect to login page
        },
        onError: (error) => {
            console.error("Signup failed:", error);
        },

    })

    const backToLogin = () => {
        navigate("/");
    };

    const submitSignUpForm:SubmitHandler<zodSignUpField> = async (formData :zodSignUpField) => {
        console.log("Prepare to mutate tanStackMutation");
        tanStackMutation.mutate(formData);
    };



  return (
    <div>
        <div style={{margin:"10px"}}>
        <Button variant="contained" color = "primary" onClick={backToLogin}>Back</Button> 
        </div>
        <form onSubmit = {handleSubmit(submitSignUpForm)}>
            <Stack direction="column" spacing={2}>
                <TextField placeholder="Email" label="Email" error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
                <TextField placeholder="Password" label="Password" type="password" error={!!errors.password} helperText={errors.password?.message} {...register("password")} />

                {/* <FormControl>
                <FormLabel id="role-label">Role</FormLabel>
                    <RadioGroup
                        aria-labelledby="role"
                        defaultValue="user"
                        name="role"
                    >
                        <FormControlLabel value="user" control={<Radio />} label="Normal User" />
                        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    </RadioGroup>
                </FormControl> */}

                <Controller
                control={control}
                name="role"
                defaultValue="user"
                render={({ field }) => (
                    <FormControl>
                    <FormLabel id="role-label">Role</FormLabel>
                    <RadioGroup
                        {...field}
                        aria-labelledby="role-label"
                        name="role"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                    >
                        <FormControlLabel value="user" control={<Radio />} label="Normal User" />
                        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    </RadioGroup>
                    </FormControl>
                )}
                />
            </Stack>
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
      </form>
    </div>
  )
}
