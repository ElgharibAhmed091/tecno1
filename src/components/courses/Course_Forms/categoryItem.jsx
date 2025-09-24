import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";

export const CategoriesItem = ({ id, title }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Memoized queryParams to prevent unnecessary recalculations
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const currentCategoryId = queryParams.get("category"); // Ensure correct key
    const isSelected = currentCategoryId === String(id); // Compare as string

    const onClick = useCallback(() => {
        if (!isSelected) {
            queryParams.set("category", id);
        } else {
            queryParams.delete("category");
        }

        // Ensure the URL doesn't end with "?"
        const newUrl = queryParams.toString() ? `${location.pathname}?${queryParams.toString()}` : location.pathname;
        navigate(newUrl, { replace: true });
    }, [isSelected, id, location.pathname, navigate, queryParams]);

    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            <button
                key={id}
                onClick={onClick}
                className={cn(
                    "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
                    isSelected && "bg-sky-700 text-white"
                )}
                type="button"
            >
                <div className="truncate">{title}</div>
            </button>
        </div>
    );
};

export default CategoriesItem;
