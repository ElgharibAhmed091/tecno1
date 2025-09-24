import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAxios from "@/utils/useAxios";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import toast from "react-hot-toast";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

const fileSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "File is required")
    .refine(
      (files) => files?.[0]?.size <= 50 * 1024 * 1024,
      "File must be less than 50MB"
    ),
});

const AssignmentUploadForm = ({ assignmentId }) => {
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const axios = useAxios();

  // Initialize form with useForm
  const form = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`api/module/student/assignment/${assignmentId}`);
        setAssignment(response.data.assignment);
        setSubmission(response.data.submission);
      } catch  {
        toast.error("Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, axios]);

  const isDuePassed = assignment?.due_date && new Date(assignment.due_date) < new Date();

  const onSubmit = async (data) => {
    if (isDuePassed) {
      toast.error("Submission is closed");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", data.file[0]);

    try {
      await axios.post(`api/module/assignment/submit/${assignmentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      form.reset();
      toast.success("Submitted successfully");
      setSubmission({
        file: data.file[0].name,
        submitted_at: new Date().toISOString(),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isDuePassed) {
      toast.error("Cannot delete after due date");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`api/module/assignment/submition/${submission.id}`);
      toast.success("Submission deleted");
      setSubmission(null);
    } catch  {
      toast.error("Failed to delete submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <Card>
        <CardHeader>
          {loading ? (
            <Skeleton className="h-8 w-48" /> // Skeleton for title
          ) : (
            <h2 className="text-xl font-semibold">{assignment?.title}</h2>
          )}
        </CardHeader>
        <CardDescription className="text-lg pl-4">
          {loading ? (
            <Skeleton className="h-6 w-full" /> // Skeleton for description
          ) : (
            assignment?.description
          )}
        </CardDescription>
        <CardFooter className="flex flex-col mt-2">
          {loading ? (
            <>
              <Skeleton className="h-6 w-32 mb-2" /> 
              <Skeleton className="h-6 w-24" /> 
            </>
          ) : (
            <>
              <p className="text-gray-600">
                Due Date: {assignment?.due_date ? format(new Date(assignment.due_date), "PPP") : "N/A"}
              </p>
              <p className="text-green-400">
                Grade: {submission?.grad ? submission?.grad : 0}/100
              </p>
            </>
          )}
        </CardFooter>
      </Card>

      {loading ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" /> 
        </div>
      ) : submission ? (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Your Submission</h3>
          <p className="text-gray-700">File: {submission.file}</p>
          <p className="text-gray-500">
            Submitted on: {format(new Date(submission.submitted_at), "PPP p")}
          </p>
          {!isDuePassed && (
            <Button
              onClick={handleDelete}
              className="mt-4 bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Submission"}
            </Button>
          )}
        </div>
      ) : (
        !isDuePassed && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Upload Assignment</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.zip"
                          {...field}
                          value={undefined}
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Uploading..." : "Upload"}
                </Button>
              </form>
            </Form>
          </div>
        )
      )}
    </div>
  );
};

export default AssignmentUploadForm;