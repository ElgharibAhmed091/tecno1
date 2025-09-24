import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const zoomMeetingSchema = z.object({
  topic: z.string().min(3, "Meeting topic must be at least 3 characters."),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute.").max(40,"Duration must be at most 40 minute."),
  start_time: z.date()
    .refine(date => date > new Date(), "Meeting must be scheduled in the future"),
});

const DateTimePicker = ({ value, onChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const isToday = value.toDateString() === new Date().toDateString();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDateChange = (date) => {
    const newDateTime = new Date(date);
    newDateTime.setHours(value.getHours());
    newDateTime.setMinutes(value.getMinutes());
    onChange(newDateTime);
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDateTime = new Date(value);
    newDateTime.setHours(hours);
    newDateTime.setMinutes(minutes);
    onChange(newDateTime);
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {
            format(value, "PPP")
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date)=>{
              if(date)handleDateChange(date);
            }}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="relative">
        <Input
          type="time"
          value={format(value, "HH:mm")}
          onChange={handleTimeChange}
          className="w-full"
          min={isToday ? format(currentTime, "HH:mm") : undefined}
        />
        <Clock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

const ZoomMeetingForm = ({ onSubmit, lesson }) => {
  const form = useForm({
    resolver: zodResolver(zoomMeetingSchema),
    defaultValues: {
      topic: lesson?.topic || "",
      duration: lesson?.duration || 30,
      start_time: lesson?.start_time ? new Date(lesson.start_time) : new Date(),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 md:p-6 bg-white rounded-lg shadow-lg">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Topic</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter meeting topic" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter duration in minutes"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !isValid} className="w-full">
          {isSubmitting ? "Creating..." : "Schedule Live Lesson"}
        </Button>
      </form>
    </Form>
  );
};

export default ZoomMeetingForm;