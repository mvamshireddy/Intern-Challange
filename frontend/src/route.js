import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import all your page components
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserStoresPage from "./pages/UserStoresPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStoresPage from "./pages/AdminStoresPage";
import StoreOwnerDashboardPage from "./pages/StoreOwnerDashboardPage";
import StoreOwnerProfilePage from "./pages/StoreOwnerprofilePage";


// --- Helper function to get user details from localStorage ---
const getUser = () => {
  const userString = localStorage.getItem("user");
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

// --- Private Route Guard ---
// This component protects routes that require a user to be logged in and have a specific role.
function PrivateRoute({ children, allowedRoles }) {
  const user = getUser();

  // Case 1: Not logged in
  if (!user || !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  // Case 2: Logged in, but does not have the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect the user to their own default dashboard
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "owner") return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }

  // Case 3: Logged in and has the correct role
  return children;
}

// --- Main AppRoutes Component ---
// Note: The <Router> component has been removed from this file.
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Normal User Routes */}
      <Route
        path="/stores"
        element={
          <PrivateRoute allowedRoles={["user"]}>
            <UserStoresPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["user", "owner", "admin"]}> 
            {/* Allowing all roles to access a profile page is common */}
            <UserProfilePage />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminUsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminStoresPage />
          </PrivateRoute>
        }
      />

      {/* Store Owner Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <PrivateRoute allowedRoles={["owner"]}>
            <StoreOwnerDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/profile"
        element={
          <PrivateRoute allowedRoles={["owner"]}>
            <StoreOwnerProfilePage />
          </PrivateRoute>
        }
      />

      {/* Default Route: Redirects based on login status and role */}
      <Route
        path="/"
        element={
          <InitialRedirect />
        }
      />
      
      {/* Fallback for any other path */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// --- Helper component for the initial redirect from "/" ---
function InitialRedirect() {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "owner":
      return <Navigate to="/owner/dashboard" replace />;
    default:
      return <Navigate to="/stores" replace />;
  }
}