import { useContext, useEffect } from "react";
import SidebarRoutes from "./sidebareRoutes";
import SidebarContext from "@/context/sidebarContext";
import SidebarCourse from "../courses/coursePage/sidebar";
import { useLocation } from "react-router-dom";

export const Sidebar = () => {
    const {
        isModules,
        sidebarList,
        setSelectedModule,
        isLoading1,
        setLocation
    } = useContext(SidebarContext);

    const loc = useLocation();

    useEffect(() => {
        setLocation(loc.pathname);
    }, [loc.pathname, setLocation]);

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
            {isModules ? (
                <div className="w-full">
                    <SidebarCourse sidebarList={sidebarList} setSelectedModule={setSelectedModule} isLoading={isLoading1} />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <SidebarRoutes />
                </div>
            )}
        </div>
    );
};

export default Sidebar;
