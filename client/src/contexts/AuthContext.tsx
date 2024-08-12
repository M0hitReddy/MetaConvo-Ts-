// import { ApiResponse } from "@/interfaces/apiResponse";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { User } from "@/interfaces/entities";
import { getUser } from "@/services/api";
import { set } from "date-fns";
// import exp from 'constants'
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const AuthContext = createContext<AuthContextProps>({
  loggedIn: false,
  checked: false,
  checkLoginState: () => {},
  user: null,
});
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  // const socket = null;
  const checkLoginState = useCallback(async (): Promise<void> => {
    try {
      const res:{ data:AuthContextProps} = await getUser();
      const { loggedIn, user } = res.data;
      setChecked(true);
      console.log(loggedIn);
      setLoggedIn(loggedIn);
      // console.log(user)
      // socket = useMemo(() => io('http://localhost:5000'), []);
      if (user) setUser(user);
      // console.log(user);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);
  // useEffect(() => {
  //     console.log(user)
  // }, [user])

  return (
    <AuthContext.Provider value={{ loggedIn, checkLoginState, user, checked }}>
      {children}
    </AuthContext.Provider>
  );
};
// const useAuth = () => useContext(AuthContext);
export { AuthContext, AuthProvider };
