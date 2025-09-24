import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";

// Define Zod validation schema
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title Required",
  }),
});

export const CreateCourse = () => {
  const navigate = useNavigate();
  const axios = useAxios(); // Use axios instance with auth
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema), // Connect Zod validation
    defaultValues: {
      title: "", // Default empty value
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/courses/", {
        title: values.title,
      });

      if (response.status === 201) {
        const courseId = response.data.id;
        toast.success("Course created successfully!");
        navigate(`/teacher/courses/edit/${courseId}`);
      } else {
        toast.error("Failed to create course.");
      }
    } catch  {
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <Helmet>
        <title>Create course</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-semibold">Name your course</h1>
        <p className="text-sm text-slate-600 mt-2">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced Web Development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What will you teach in this course?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link to="/">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCourse;
