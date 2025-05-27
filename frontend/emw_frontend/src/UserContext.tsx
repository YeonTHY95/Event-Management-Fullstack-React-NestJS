// context/UserContext.tsx
import { createContext, useContext, useState, type SetStateAction } from "react";
import type { userType } from "./App";


type loginUserType = {
  email : string | null;
  password : string | null;  
  isAdmin : boolean | null;
  id : number | null;
  name? : string | null;

}

type UserContextType = {
  user: loginUserType | null;
  setUser: React.Dispatch<SetStateAction<loginUserType | null>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<loginUserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);