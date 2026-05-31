import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PetGameHub from "./pages/PetGameHub";
import Profile from "./pages/Profile";
import CritterGallery from "./pages/CritterGallery";
import { authService } from "./services/api";

// Simple route guard for auth-only pages
const ProtectedRoute = ({ children }) => {
  const isAuth = authService.isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Route guard to prevent logged-in users from visiting login/signup
const PublicRoute = ({ children }) => {
  const isAuth = authService.isAuthenticated();
  return isAuth ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public Gallery Page */}
        <Route path="/gallery" element={<CritterGallery />} />

        {/* Public Auth Pages with guards */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Game Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PetGameHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
