import { useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import SidebarContext from "@/context/sidebarContext";

export const SidebarLinks = () => {
    const { user } = useContext(AuthContext);
    const { setLinks } = useContext(SidebarContext);
    useEffect(() => {
        let sidebarLinks = [];
        if (user) {

            if (user.role === "student") {
                sidebarLinks = [
                {label:'My Dashboard',link:'/student/dashboard'},
                {label:'My Statistics',link:'/student/statistics'},
                {label:'My profile',link:`/user/profile/${user.user_id}`}
            ];
        } else if (user.role === "instructor") {
            sidebarLinks = [
                {label:'My profile',link:`/user/profile/${user.user_id}`},
                {label:'My Dashboard',link:'/teacher/dashboard'},
                {label:'My Statistics',link:'/teacher/statistics'},
            ];
        } else if (user.role === "admin") {
            sidebarLinks = [
                {label:'Dashboard',link:'/admin/dashboard'} ,
                {label:'Users',link:'/admin/users'},
                {label:'User Statistics',link:'/admin/statistics/users'},
                // {label:'Courses',link:'/site/courses'},
                {label:'Categories',link:'/admin/categories'},
                {label:'Categories Statistics',link:'admin/statistics/categories'},
                {label:'Courses',link:'/admin/courses'},
                {label:'Courses Statistics',link:'admin/statistics/courses'},
                {label:'Enrollments Statistics',link:'admin/statistics/Enrollments'},
                {label:'Finalexams Statistics',link:'/admin/statistics/FinalExams'},
                {label:'Modules Statistics',link:'/admin/statistics/modules'},
                {label:'Lessons Statistics',link:'/admin/statistics/lessons'},
                {label:'Quizzes Statistics',link:'/admin/statistics/Quizzes'},
                {label:'Assignments Statistics',link:'/admin/statistics/Assignment'},

                {label:'Create FAQ',link:'/admin/FAQ'}, 
                {label:'LiveSupport',link:'/admin/live/support/create'}, 
                {label:'News',link:'/admin/News'} ,
            ];
        }
    }
        setLinks(sidebarLinks); 
    }, [user, setLinks]);

    return null; // This component only updates context, so it doesn't need to return JSX
};

export default SidebarLinks;
