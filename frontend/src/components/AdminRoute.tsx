import { useAuth } from "../auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
