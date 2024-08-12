import { ReactNode, useEffect, useRef, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatsProvider } from "./contexts/ChatsContext";
import { SocketProvider } from "./contexts/SocketContext";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuth } from "./hooks/useAuth";
import Callback from "./components/Callback";
import AuthenticationPage from "./pages/Authentication";
import { Home } from "./pages/Home";
import { ChatDisplay } from "./components/ChatDisplay";

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <ChatsProvider>
            {/* <SocketProvider> */}
            <ThemeProvider>
              <div className="">
                <Routes>
                  <Route path="/auth/google/callback" element={<Callback />} />
                  <Route
                    path="/login"
                    element={<AuthenticationPage type={"login"} />}
                  />
                  <Route
                    path="/signup"
                    element={<AuthenticationPage type={"signup"} />}
                  />
                  <Route path="/about" element={<h1>About</h1>} />
                  <Route path="/contact" element={<h1>Contact</h1>} />
                  <Route
                    path="/"
                    element={<ProtectedRoute element={<Home />} />}
                  >
                    <Route path="t/:user_id" element={<ChatDisplay />} />
                  </Route>
                  {/* </ChatsProvider> */}
                  <Route path="*" element={"not found"} />
                </Routes>
              </div>
           </ThemeProvider>
            {/* </SocketProv ider> */}
          </ChatsProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

const ProtectedRoute = ({ element }: { element: ReactNode }) => {
  const { loggedIn, checked, checkLoginState } = useAuth();
  const navigate = useNavigate();

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    console.log(loggedIn, checked, "protected route");
    if (!checked) return;
    if (checkLoginState) {
      checkLoginState();
    }
    if (checked && !loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, checked, checkLoginState, navigate]);

  return (
    <>
      <SocketProvider>{element}</SocketProvider>
    </>
  );
};

export default App;
