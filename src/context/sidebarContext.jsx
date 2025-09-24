import { createContext, useState, useEffect } from "react";

const SidebarContext = createContext();
export default SidebarContext;

export const SidebarProvider = ({ children }) => {
  const [links, setLinks] = useState([]);
  const [isModules, setIsModules] = useState(false);
  const [sidebarList, setSidebarList] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [isLoading1, setIsLoading1] = useState('');
  const [location,setLocation]=useState('')

  // Function to check if the current URL matches the /course/<UUID> pattern
  const checkCourseUrl = () => {
    const courseUrl = /^\/course\/[0-9a-fA-F-]{36}$/.test(location);
    setIsModules(courseUrl);
  };

  useEffect(() => {
    // Check the URL when the component mounts
    checkCourseUrl();

    // Listen for popstate events (triggered on browser back/forward)
    window.addEventListener('popstate', checkCourseUrl);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('popstate', checkCourseUrl);
    };
  }, [location]);

  const context = {
    links,
    setLinks,
    isModules,
    setIsModules,
    sidebarList,
    setSidebarList,
    selectedModule,
    setSelectedModule,
    isLoading1,
    setIsLoading1,
    location,
    setLocation
  };

  return (
    <SidebarContext.Provider value={context}>
      {children}
    </SidebarContext.Provider>
  );
};
