import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const SearchInput = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [value, setValue] = useState(queryParams.get("title") || ""); // Initialize with URL param

    // Updates the search query in the URL
    const search = useCallback(() => {
        const trimmedValue = value.trim();

        if (trimmedValue) {
            queryParams.set("title", trimmedValue);
        } else {
            queryParams.delete("title"); // Remove param if empty
        }

        const newUrl = queryParams.toString() ? `${location.pathname}?${queryParams.toString()}` : location.pathname;
        navigate(newUrl, { replace: true });
    }, [value, location.pathname, navigate, queryParams]);

    // Handle "Enter" key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            search();
        }
    };

    // Clear search input and remove URL parameter
    const clearSearch = () => {
        setValue("");
        queryParams.delete("title");
        navigate(location.pathname, { replace: true });
    };

    return (
        <div className="relative">
            {/* Search Icon */}
            <button
                className="absolute top-3 left-3 text-slate-600"
                onClick={search}
            >
                <Search className="h-4 w-4" />
            </button>

            {/* Search Input */}
            <Input
                className="w-full md:w-[300px] pl-9 pr-10 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Search for a course"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown} // Handle Enter key press
            />

            {/* Clear Button (X) */}
            {value && (
                <button 
                    className="absolute top-3 right-3 text-slate-600 hover:text-black"
                    onClick={clearSearch}
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
