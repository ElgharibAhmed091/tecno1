import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const TeacherRoutes = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (user.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default TeacherRoutes;
