import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// ✅ Define validation schema
const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  due_date: z.date({ required_error: "Due date is required." }),
});

const AssignmentForm = ({assignment,onSubmit,disabled}) => {
  const form = useForm({
    resolver: zodResolver(assignmentSchema),
    disabled: disabled,
    defaultValues: assignment
      ? { ...assignment, due_date: new Date(assignment?.due_date) }
      : { title: "", description: "", due_date: null },
  });
  const{isSubmitting,isValid}=form.formState



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter assignment title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter assignment description" className=" h-[150px]"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date Picker */}
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between">
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => form.setValue("due_date", date)}
                      showOutsideDays={false}
                      disabled={(date) => date < new Date()} 
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting || !isValid} className="w-full">
          {isSubmitting ? "Submitting..." : assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </form>
    </Form>
  );
};

export default AssignmentForm;
