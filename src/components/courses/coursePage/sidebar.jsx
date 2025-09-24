import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronDown, ClipboardList, PencilLine, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SidebarCourse = ({ sidebarList, setSelectedModule, isLoading }) => {
  const [expandedModules, setExpandedModules] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleItemClick = (moduleId, itemId, type) => {
    setSelectedModule({ module: moduleId, item: itemId, type: type });
    setActiveItem(`${moduleId}-${itemId}`);
  };

  if (isLoading || !sidebarList || Object.keys(sidebarList).length === 0) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Destructure finalExam from the sidebarList if it exists
  const { finalExam, ...modules } = sidebarList;

  return (
    <div className="space-y-1 w-full p-2">
      {/* Render regular modules */}
      {Object.entries(modules).map(([moduleId, items]) => (
        <div key={moduleId} className="group">
          <Button
            size="lg"
            variant="ghost"
            onClick={() => toggleModule(moduleId)}
            className={cn(
              "w-full flex justify-between items-center px-4 py-3 rounded-xl",
              "hover:bg-gray-50/50 transition-colors duration-200",
              "border border-transparent hover:border-gray-200"
            )}
          >
            <div className="flex items-center gap-3">
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  expandedModules[moduleId] ? "rotate-180" : "rotate-0"
                )}
              />
              <span className="font-medium text-gray-700">{moduleId}</span>
            </div>
            
            {items.completed && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
          </Button>

          <AnimatePresence>
            {expandedModules[moduleId] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-8 ml-4 border-l-2 border-gray-100"
              >
                <ul className="space-y-1">
                  {items.items.map(
                    ({ itemType, itemName, moduleId, itemId, completed }, index) => {
                      const isActive = activeItem === `${moduleId}-${itemId}`;
                      
                      return (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                            "transition-all duration-200 hover:bg-gray-50",
                            isActive 
                              ? "bg-blue-50/50 border-l-4 border-blue-500"
                              : "hover:border-l-2 hover:border-blue-200"
                          )}
                          onClick={() => handleItemClick(moduleId, itemId, itemType)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {itemType === "assignment" ? (
                              <PencilLine className="w-4 h-4 text-blue-400" />
                            ) : itemType === "quiz" ? (
                              <ClipboardList className="w-4 h-4 text-purple-400" />
                            ) : itemType === "lesson" ? (
                              <BookOpen className="w-4 h-4 text-green-400" />
                            ) : null}
                            
                            <span className={cn(
                              "text-sm",
                              isActive ? "text-blue-600 font-medium" : "text-gray-600"
                            )}>
                              {itemName}
                            </span>
                          </div>
                          
                          {completed && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                        </motion.li>
                      );
                    }
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Conditionally render Final Exam */}
      {finalExam && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            size="lg"
            variant="ghost"
            onClick={() => handleItemClick("final-exam", "final-exam", "final-exam")}
            className={cn(
              "w-full flex justify-between items-center px-4 py-3 rounded-xl",
              "hover:bg-red-50/50 transition-colors duration-200",
              "border border-transparent hover:border-red-200",
              activeItem === "final-exam-final-exam" 
                ? "bg-red-50/50 border-l-4 border-red-500"
                : ""
            )}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-red-400" />
              <span className="font-medium text-gray-700">Final Exam</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SidebarCourse;