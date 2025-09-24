import { MobileSidebar } from "./mobile-sidebar";
import NavbarRoutes from "./navbarRoutes";
import moment from 'moment-hijri'; 
import Logo from "./logo";

export const Navbar = () => {
    const hijriDate = moment().format('iDD/iMM/iYYYY');
    const gregorianDate = moment().format('DD/MM/YYYY');

    return (
        <div className="border-b h-full w-full bg-white shadow-sm">
            {/* Mobile View */}
            <div className="flex w-full items-center p-4 md:hidden justify-between">
                <div className="flex flex-1 justify-start">
                    <Logo />
                </div>
                <div className="flex flex-col items-center flex-1">
                    <span className="text-sm font-medium text-muted-foreground">
                        {hijriDate}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {gregorianDate}
                    </span>
                </div>
                <div className="flex flex-1 justify-end">
                    <MobileSidebar />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-between px-6 h-16">
                <Logo />
                
                <div className="flex items-center gap-8">
                    <NavbarRoutes />
                    <div className="flex flex-col items-end border-l pl-6 ml-6">
                        <span className="text-sm font-medium text-muted-foreground">
                            {hijriDate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {gregorianDate}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};