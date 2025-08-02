import { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const location = useLocation();

  useEffect(() => {
    checkAuth();

    // Optional: fallback timeout if auth check hangs
    const timeout = setTimeout(() => {
      console.warn("Auth check timeout — forcing exit.");
      useAuthStore.setState({ isCheckingAuth: false });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={authUser ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;