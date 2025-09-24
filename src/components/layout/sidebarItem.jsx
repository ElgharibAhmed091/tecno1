import { cn } from "@/lib/utils"; 
import { useLocation, useNavigate } from "react-router-dom";

export const SidebarItem = ({ label, link }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === link;

  const onClick = () => {
    navigate(link);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={label} // Accessibility improvement
      className={cn(
        "w-full flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-sky-700 bg-sky-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <span>{label}</span>
      </div>
      {/* Active Link Indicator */}
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-12 w-1 transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default SidebarItem;
