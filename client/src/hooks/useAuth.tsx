import { AuthContext } from "@/contexts/AuthContext";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { useContext } from "react";

const useAuth = ():AuthContextProps => useContext(AuthContext);
export { useAuth };
