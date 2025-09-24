import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition right-0">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <SheetTitle className="sr-only">Mobile Sidebar</SheetTitle>
                <SheetDescription className="sr-only">This is the mobile navigation sidebar</SheetDescription>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
