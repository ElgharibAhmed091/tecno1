import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useState } from "react";
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

const formSchema = z.object({
    hours: z.number().min(1, {
      message: "hours Required",
    }),
});

export const HoursForm = ({ initialData, courseId,setInitial }) => {
    const axios = useAxios();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hours: initialData.hours || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values) => {
        try {
            const response = await axios.patch(`/api/instructor/course/${courseId}/`, values);
            toast.success('Course updated');
            setInitial(response.data)
        } catch {
            toast.error('Something went wrong');
        }
        finally{

            setIsEditing(false)
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Hours
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? "Cancel" : <>
                        <Pencil className="h-4 w-4 mr-2"/> Edit Hours
                    </>}
                </Button>
            </div>
            {!isEditing && (<p className="text-sm mt-2">{`${initialData?.hours} Hour`}</p>)}
            
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name="hours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Hours</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))} 
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

export default HoursForm;
