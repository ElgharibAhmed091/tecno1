const ModuleContent = ({ selectedModule }) => {
  if (!selectedModule) {
    return <div className="text-gray-500">Select a module to view its content.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{selectedModule.title}</h2>

      {/* Lessons */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Lessons</h3>
        {selectedModule.lessons.map((lesson) => (
          <div key={lesson.id} className="p-4 border-b border-gray-200">
            <h4 className="font-medium">{lesson.title}</h4>
            <p className="text-gray-600">{lesson.content}</p>
          </div>
        ))}
      </div>

      {/* Quizzes */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Quizzes</h3>
        {selectedModule.quizzes.map((quiz) => (
          <div key={quiz.id} className="p-4 border-b border-gray-200">
            <h4 className="font-medium">{quiz.title}</h4>
          </div>
        ))}
      </div>

      {/* Assignments */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Assignments</h3>
        {selectedModule.assignments.map((assignment) => (
          <div key={assignment.id} className="p-4 border-b border-gray-200">
            <h4 className="font-medium">{assignment.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleContent;