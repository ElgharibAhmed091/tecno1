import { useEffect, useState} from "react";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";
import { Skeleton } from "@/components/ui/skeleton";
import { File } from "lucide-react";


const StudentResources = ({courseId}) => {
  const axios = useAxios();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`/api/student/course/resources/${courseId}`);
        setResources(response?.data?.resources);
      } catch {
        toast.error("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [courseId]);
  return (
    <div className="p-6">
      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        // Resources List
        <ul className="space-y-3">
            {resources.length === 0 ? (
                <p className="text-gray-500">No resources available.</p>
            ) : (
                resources.map((resource) => (
                <li key={resource.id} className="flex justify-between items-center p-3 bg-white shadow-md rounded-lg">
                    <a href={resource.material} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    <File/> {resource?.material?.split("/").pop()}
                    </a>
                </li>
                ))
            )}
        </ul>

      )}
    </div>
  );
};

export default StudentResources;
