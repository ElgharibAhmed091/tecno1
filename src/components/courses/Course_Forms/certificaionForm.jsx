import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { Upload, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
  certificate_template: z.instanceof(File)
    .refine(file => file !== undefined, "File is required")
    .refine(file => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only PDF files are allowed"
    )
});

export const CertificationForm = ({ courseId }) => {
  const axios = useAxios();
  const [isEditing, setIsEditing] = useState(false);
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch certification on mount and when courseId changes
  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const response = await axios.get(`/api/course/certification/`, {
          params: { course: courseId }
        });
        // Assuming API returns array, take first item
        setCertification(response.data[0] || null);
      } catch  {
        toast.error('Failed to fetch certification');
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [courseId]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificate_template: undefined
    }
  });

  const { isSubmitting, isValid } = form.formState;

  // Handle certification upload
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("certificate_template", values.certificate_template);
      formData.append("course", courseId);

      const response = await axios.post(
        '/api/course/certification/',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      // Assuming API returns the uploaded certification
      setCertification(response.data);
      toast.success('Certification uploaded successfully');
      form.reset();
      setIsEditing(false);
    } catch  {
      toast.error('Failed to upload certification');
    }
  };

  // Handle certification deletion
  const handleDelete = async (certificationId) => {
    try {
      await axios.delete(`api/course/certification/${certificationId}`);
      setCertification(null);
      toast.success('Certification deleted successfully');
    } catch  {
      toast.error('Failed to delete certification');
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-4">
        Course Certification Template
        {!certification && (
          <Button onClick={() => setIsEditing(!isEditing)} variant='ghost'>
            <Upload className="h-4 w-4 mr-2" /> Upload Template
          </Button>
        )}
      </div>

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="certificate_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification PDF Template</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      disabled={isSubmitting}
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Certification Display */}
      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="text-muted-foreground">Loading certification...</div>
        ) : certification ? (
          <div className="flex items-center justify-between p-3 border rounded-md bg-white">
            <div className="flex items-center gap-2">
              <span className="text-sm">{certification.file_name}</span>
              <a
                href={certification.certificate_template}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View
              </a>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(certification.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            No certification template added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationForm;