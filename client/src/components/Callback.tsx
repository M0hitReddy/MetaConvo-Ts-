import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { ApiResponse } from "@/interfaces/apiResponse";
import { getToken } from "@/services/api";

function Callback() {
  const { loggedIn, checkLoginState }: AuthContextProps = useAuth();
  const called = useRef<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (!loggedIn) {
        try {
          if (called.current) return;
          called.current = true;
          const res: { data: ApiResponse } = await getToken(window.location.search)
          console.log(res.data.token);
          if(checkLoginState) checkLoginState();
          navigate("/"); 
        } catch (err) {
          console.error(err);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    })();
  }, [checkLoginState, loggedIn, navigate]);
  return <></>;
}

export default Callback;
