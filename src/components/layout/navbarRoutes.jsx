import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import SearchInput from "../courses/search-input";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export const NavbarRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const isInstructorPage = location.pathname?.startsWith('/teacher');
    const isCoursePage=location.pathname?.startsWith('/courses')
    const {user,logoutUser}=useContext(AuthContext)
    return (
        <>
            {
                isCoursePage &&(
                    <div className="hidden md:block self-center"> 
                        <SearchInput />
                    </div>
                )
            }
            <div className="flex gap-x-2 ml-auto">
                <Link to='/'>
                    <Button size="sm" variant="ghost">Home</Button>
                </Link>
                <Link to='/courses'>
                    <Button size="sm" variant="ghost">Courses</Button>
                </Link>
                {user ? (
                    <>
                        <Button size="sm" variant="ghost" onClick={()=>{logoutUser();navigate('/login')}}>
                            Logout
                        </Button>
                        <Button size="sm" variant="ghost">
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
                    </>
                ) : (
                    <>
                    <Link to='/teacher/signup'>
                        <Button size="sm" variant="ghost">Teach with us</Button>
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" variant="ghost">sign up</Button>
                    </Link>
                    <Link to="/login">
                        <Button size="sm" variant="ghost">login</Button>
                    </Link>
                    </>
                )}
            </div>
        </>
    );
};

export default NavbarRoutes;
