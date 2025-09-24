import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { ImageIcon, Pencil, PlusCircle, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    image: z.any().refine((file) => file instanceof File, {
      message: "Please select a valid image file",
    }),
});

export const ImageForm = ({ initialData, courseId,setInitial }) => {
    const axios = useAxios();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(initialData.image || "");

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
          setPreview(URL.createObjectURL(file));
          form.setValue("image", file, { shouldValidate: true });
        }
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: initialData.image || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;
    
    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("image", values.image);
        
        try {
            const response = await axios.patch(`/api/instructor/course/${courseId}/`, 
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            toast.success("Course updated");
            setInitial(response.data)
        } catch {
            toast.error("Something went wrong");
        }
        finally{
            setIsEditing(false)
        }
    };
    
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? "Cancel" : (
                        !initialData.image ? (
                            <><PlusCircle className="h-4 w-4 mr-2"/>Add image</>
                        ) : (
                            <><Pencil className="h-4 w-4 mr-2"/> Edit image</>
                        )
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.image ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <img src={initialData.image} alt="Upload" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                )
            )}
            
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Image</FormLabel>
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="object-cover rounded-md" />
                                        ) : (
                                            <>
                                                <UploadCloud className="h-10 w-10 mb-2 text-gray-500" />
                                                <p className="font-medium text-gray-600">Choose files or drag and drop</p>
                                                <p className="text-sm text-gray-400">Image (4MB max)</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="button" variant="ghost" onClick={toggleEdit}>Cancel</Button>
                            <Button type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Submitting..." : "Save"}</Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default ImageForm;
