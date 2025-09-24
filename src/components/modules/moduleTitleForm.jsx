import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title Required",
  }),
});

export const ModuleTitleForm = ({ open, setOpen, order, module, courseId,setInitModules ,disabled }) => {
  const axios = useAxios();
  const navigate=useNavigate()

  const form = useForm({
    resolver: zodResolver(formSchema),
    disabled: disabled,
    defaultValues: {
      title: module?.title || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      if (module) {
        let response=await axios.patch(`/api/module/${module.id}/action`, {
          ...values,
        });
        setInitModules((prev)=>prev.map((m)=>m.id===response.data?.id?response.data:m))
        toast.success("Module Updated Successfully");
      }
      else {
        await axios.post("/api/module/create", {
          ...values,
          course: courseId,
          order: order,
        });
        toast.success("Module Created Successfully");
        navigate(0)
      }
      // navigate(0);
    } catch  {
      toast.error("Oops! Something went wrong");
    }
    finally{
      setOpen(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{module ? "Edit Module" : "Add New Module"}</DialogTitle>
          <DialogDescription>Please fill the form</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" disabled={disabled}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the Course'"
                      {...field} // ✅ Corrected missing value
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting} className="bg-blue-600">
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2" /> Submitting...
                  </>
                ) : (
                  module ? "Update" : "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleTitleForm;
