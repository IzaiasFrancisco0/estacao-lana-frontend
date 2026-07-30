import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}
