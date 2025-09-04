import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserStoresPage from "./pages/UserStoresPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStoresPage from "./pages/AdminStoresPage";
import StoreOwnerDashboardPage from "./pages/StoreOwnerDashboardPage";
import StoreOwnerProfilePage from "./pages/StoreOwnerProfilePage";

// --- Auth & Role Guards ---
function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  // Not logged in
  if (!token) return <Navigate to="/login" replace />;
  // Role-based access
  if (roles && !roles.includes(role)) {
    // Redirect to own dashboard if wrong role
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "owner") return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User */}
        <Route
          path="/stores"
          element={
            <PrivateRoute roles={["user"]}>
              <UserStoresPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute roles={["user"]}>
              <UserProfilePage />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminUsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminStoresPage />
            </PrivateRoute>
          }
        />

        {/* Store Owner */}
        <Route
          path="/owner/dashboard"
          element={
            <PrivateRoute roles={["owner"]}>
              <StoreOwnerDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <PrivateRoute roles={["owner"]}>
              <StoreOwnerProfilePage />
            </PrivateRoute>
          }
        />

        {/* Default: redirect to login or correct dashboard */}
        <Route
          path="/"
          element={
            <RequireRedirect />
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Redirect root "/" to correct dashboard or login
function RequireRedirect() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "owner") return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}