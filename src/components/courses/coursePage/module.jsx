import React from "react";

const ModuleList = ({ modules, setSelectedModule }) => {
  return (
    <div className="mt-2">
      {modules.length>0?
        modules.map((module) => (
          <div
            key={module.id}
            onClick={() => setSelectedModule(module)}
            className="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded"
          >
            {module.title}
          </div>
        )):null
      }
    </div>
  );
};

export default ModuleList;