import { z } from "zod";
import useAxios from "@/utils/useAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import toast from "react-hot-toast";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

// Define Zod validation schema
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title Required",
  }),
});

export const CreateCategory = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/admin/categories/", {
        name: values.title,
      });
      if (response.status === 201) {
        toast.success("Category created successfully!");
        navigate("/admin/categories");
      } else {
        toast.error("Failed to create category.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center h-full p-6">
      <Helmet>
        <title>Category</title>
      </Helmet>
      <div className="max-w-5xl w-full">
        <h1 className="text-2xl font-semibold">Category Name</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. 'Web Development'"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link to="/Admin/Categories/">
                <Button type="button" variant="ghost" disabled={loading}>Cancel</Button>
              </Link>
              <Button type="submit" disabled={!isValid || loading}>
                {loading ? "Submitting..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCategory;
