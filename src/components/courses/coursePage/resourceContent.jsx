
const ResourceList = ({ resources }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resources</h2>
      {resources.map((resource) => (
        <div key={resource.id} className="p-4 border-b border-gray-200">
          <h3 className="font-medium">{resource.title}</h3>
          <p className="text-gray-600">{resource.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;