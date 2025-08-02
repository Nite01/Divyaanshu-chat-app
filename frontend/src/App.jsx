import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import {useAuthStore} from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import {Toaster} from 'react-hot-toast';

const App = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Login />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Home />} />
        <Route path="/login" element={!authUser ? <Login /> : <Home />} />
        <Route path="/settings" element={authUser ? <Settings /> : <Login />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Login />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
