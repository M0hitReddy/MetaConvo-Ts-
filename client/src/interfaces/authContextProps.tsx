import { User } from "./entities";

export interface AuthContextProps {
    loggedIn: boolean ;
    checked?: boolean;
    checkLoginState?: () => void | Promise<void>;
    user: User | null;
  }