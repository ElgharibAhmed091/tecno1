import ToastProvider from "@/components/ui/providers/toaster-provider";
import { Navbar } from "./navbar";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import SidebarContext from "@/context/sidebarContext";
import { cn } from "@/lib/utils";
import Footer from "./footer";

const Layout = () => {
  const {links}=useContext(SidebarContext)
  return (
    <div className="h-full">
      {/* Fixed Navbar */}
      <div className="h-[80px] fixed top-0 w-full z-50">
        <Navbar/>
      </div>
      {
      }
      {links.length?(
      <div className="hidden mt-[81px] md:flex h-full w-64 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>):null}

      {/* Main Content (with padding to avoid overlap) */}
      <main className={cn("pt-[80px] h-full min-h-screen max-w-[1800px] mx-auto ml-6",links.length&&'md:pl-56')}>
        <ToastProvider/>
        <Outlet />
      </main>
      {/* Footer */}
      <div className={cn("pt-[80px] max-w-[1800px] mx-auto md:ml-6",links.length&&'md:pl-56')}>
      <Footer/>
      </div>
    </div>
  );
};

export default Layout;
