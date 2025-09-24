import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    learned: z.array(z.object({
        id: z.number().nullable(), 
        text: z.string().min(1, { message: "Cannot be empty" })
    })).nonempty({ message: "At least one learning point is required" }),
});

export const LearnedForm = ({ initialData, courseId, setInitial }) => {
    const axios = useAxios();
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { 
            learned: initialData.learned 
                ? initialData.learned.map(item => ({ id: item?.id || null, text: item?.text })) 
                : [{ id: null, text: "" }] // At least one empty field
        },
        mode: "onChange",
    });
    useEffect(() => {
        if (initialData?.learned) {
            form.reset({
                learned: initialData.learned.map(item => ({ id: item?.id || null, text: item?.text })),
            });
        }
    }, [initialData, form]);

    const { control, handleSubmit, setValue, watch, formState: { isSubmitting, isValid } } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "learned" });

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values) => {
        try {
            const response=await axios.put(`/api/instructor/course/learned/update/${courseId}`, values);
            toast.success("Course updated");
            setInitial((prev) => ({ ...prev, learned:response.data}));
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                What will be learned in the course
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <ul className="text-sm mt-2">
                    {fields.length > 0 ? fields.map((item, index) => (
                        <li key={item.id || index}>• {item.text}</li>
                    )) : <p>No items added yet.</p>}
                </ul>
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        {fields.map((item, index) => (
                            <div key={item.id || index} className="flex items-center gap-x-2">
                                <Input
                                    {...form.register(`learned.${index}.text`)}
                                    placeholder="e.g. 'Advanced Web Development'"
                                    onChange={(e) => setValue(`learned.${index}.text`, e.target.value, { shouldValidate: true })}
                                    disabled={isSubmitting}
                                />
                                <input type="hidden" {...form.register(`learned.${index}.id`)} />
                                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => append({ id: null, text: "" })} 
                            className="flex items-center"
                        >
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Item
                        </Button>

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

export default LearnedForm;
