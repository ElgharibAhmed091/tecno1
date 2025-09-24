import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

//validation
const formSchema = z.object({
    category_id: z.number().int().positive({
        message: "Category is required",
    }),
});
//function
export const CategoryForm = ({ initialData, courseId, options,setInitial }) => {
    const axios = useAxios();
    const [isEditing, setIsEditing] = useState(false);
    const selectedOption = options?.find((option) => option.value === initialData?.category?.id);
    
    const toggleEdit = () => {
        setIsEditing((current) => !current);
    };

    //connect the form with the validator
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category_id: initialData?.category?.id || "", 
        },
    });
    

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values) => {
        try {
            let response = await axios.patch(`/api/instructor/course/${courseId}/`, values);
            setInitial(response.data)
            toast.success("Course updated");
        } catch {
            toast.error("oops! Something went wrong please try again later");
        }
        finally{
            setIsEditing(false)
        }
    };
    
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course category
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/> Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData?.category?.id && "text-slate-500 italic")}>
                    {selectedOption?.label || "No Category"}
                </p>
            )}
            
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Category </FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            value={field.value}
                                            onChange={(selectedValue) => {
                                                field.onChange(selectedValue)
                                                form.trigger("category");
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="button" variant="ghost" onClick={toggleEdit}>Cancel</Button>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
export default CategoryForm;
