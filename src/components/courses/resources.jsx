import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm, } from "react-hook-form";
import DelationPopup from "../modules/confirmDeletion";
import { File } from "lucide-react";

const MAX_FILE_SIZE_MB = 50;

const Resources = () => {
  const { courseId } = useParams();
  const axios = useAxios();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const[isDeteing,setIsdeleting]=useState(false)
  const[isDeletingOpen,setIsdeletingOpen]=useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  const formMethods = useForm({
    defaultValues: { material: null },
  });

  const { handleSubmit, reset, setError, clearErrors } = formMethods;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`/api/instructor/courses/${courseId}/resources`);
        setResources(response.data);
      } catch {
        toast.error("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [courseId]);

  const handleUpload = async (data) => {
    if (!data.material) {
        toast.error("No file selected!");
        return;
    }

    const formData = new FormData();
    formData.append("material", data.material); // ✅ Correctly append file

    setUploading(true);
    try {
        const response = await axios.post(
            `/api/instructor/courses/${courseId}/resources`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        setResources((prev) => [...prev, response.data]);
        toast.success("Resource uploaded successfully!");
        reset(); // Reset form fields
        setIsDialogOpen(false);
    } catch {
        toast.error("Failed to upload resource.");
    } finally {
        setUploading(false);
    }
};


  const handleFileChange = (event, field) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError("material", { type: "size", message: `File size must not exceed ${MAX_FILE_SIZE_MB}MB.` });
        toast.error(`File size must not exceed ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      clearErrors("material");
      field.onChange(file);
    }
  };

  const handleDelete = async (resourceId) => {
    setIsdeleting(true)
    try {
      await axios.delete(`/api/instructor/courses/resource/${resourceId}`);
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
      toast.success("Resource deleted successfully!");
    } catch {
      toast.error("Failed to delete resource.");
    }
    finally{
        setIsdeleting(false)
        setIsdeletingOpen(false)
    }
  };

  return (
    <div className="p-6">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Course Resources</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900/50 text-white">Upload Resource</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a Resource</DialogTitle>
            <DialogDescription>upload the file here </DialogDescription>
            </DialogHeader>
            <Form {...formMethods}>
              <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
                <FormField
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e, field)}
                            className="hidden"
                          />
                        {field.value &&(
                              <div className="flex items-center gap-1">
                              <File/>
                              <p className="mt-2 text-sm text-gray-600">{field.value.name}</p>
                              </div>
                              )
                          }
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="w-full bg-gray-200 text-black"
                          >
                            Choose File
                          </Button>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
                    <DelationPopup
                    key={resource.id}
                    handelClick={()=>handleDelete(resource.id)}
                    isDeleting={isDeteing}
                    name="Resource"
                    isDeleteDialogOpen={isDeletingOpen}
                    setIsDeleteDialogOpen={setIsdeletingOpen}
                    />
                </li>
                ))
            )}
        </ul>

      )}
    </div>
  );
};

export default Resources;
