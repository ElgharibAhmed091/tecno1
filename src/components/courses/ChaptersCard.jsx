import { ChevronDown, ChevronUp, BookOpen, PlayCircle } from "lucide-react";
import { useState } from "react";

const ChaptersCard = ({ modules }) => {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <div className="space-y-4">
      {modules.length > 0 ? (
        modules.map((module) => (
          <div key={module?.id} className="border rounded-lg overflow-hidden">
            {/* Module Header */}
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleModule(module?.id)}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">{module?.title}</h3>
              </div>
              <button className="p-1 hover:bg-gray-200 rounded">
                {expandedModules[module?.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Lessons */}
            {expandedModules[module?.id] && (
              <div className="p-4 bg-white">
                {module.lessons.length > 0 ? (
                  module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <PlayCircle className="h-5 w-5 text-gray-600" />
                      <p className="text-gray-700">{lesson?.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No lessons available.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No modules available.</p>
      )}
    </div>
  );
};

export default ChaptersCard;