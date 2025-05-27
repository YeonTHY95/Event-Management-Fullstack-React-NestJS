import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { QueryClient,QueryClientProvider} from '@tanstack/react-query'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import SignUp from './SignUp.tsx';
import UserView from './UserView.tsx';

import { UserProvider } from './UserContext';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    
  },
  {
    path: "/signup",
    element : <SignUp />,
  },
  {
    path: "/userview",
    element : <UserView />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      {/* 
        <App />
       */}
    </QueryClientProvider>
  </StrictMode>,
)
