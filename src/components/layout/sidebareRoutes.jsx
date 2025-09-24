import { useContext } from "react";
import SidebarItem from "./sidebarItem";
import SidebarContext from "@/context/sidebarContext";
import AuthContext from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const SidebarRoutes = () => {
  const { links = [] } = useContext(SidebarContext); // Ensure links is always an array
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const navLinks = user
    ? [
        { label: "Home", link: "/" },
        { label: "Courses", link: "/courses" },
      ]
    : [
        { label: "Login", link: "/login" },
        { label: "Teach with Us", link: "/teacher/signup" },
        { label: "Sign Up", link: "/signup" },
        { label: "Home", link: "/" },
        { label: "Courses", link: "/courses" },
      ];
  return (
    <nav className="flex flex-col w-full">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        {user ? (
          <div className="border-b border-slate-600 flex flex-col items-start"> 
            <Button size="sm" className='w-full justify-start' variant="ghost">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-1 border-gray-300 object-cover"
                  referrerPolicy="no-referrer"

                />
              ) : (
                <User className="w-24 h-24 rounded-full border-2 border-gray-300 text-gray-400" />
              )}
              {user.username}
            </Button>
            <Button size="sm" variant="ghost" className='ml-2 mt-2 w-full justify-start' onClick={() => { logoutUser(); navigate('/login') }}>
              Logout
            </Button>
          </div>
        ) : null}
        {navLinks.map((route) => (
          <SidebarItem key={route.link} label={route.label} link={route.link} />
        ))}
      </div>

      {/* Sidebar Links */}
      {links.map((route) => (
        <SidebarItem key={route.link} label={route.label} link={route.link} />
      ))}
    </nav>
  );
};

export default SidebarRoutes;