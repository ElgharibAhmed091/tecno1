import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const UnAuthRoutes = () => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" /> : <Outlet />;
};

export default UnAuthRoutes;
