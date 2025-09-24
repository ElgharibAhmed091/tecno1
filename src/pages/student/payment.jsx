import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Loader2, CreditCard } from "lucide-react";
import useAxios from "@/utils/useAxios";
import { Helmet } from "react-helmet-async";

// Validation schema using Zod
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Invalid format (XXXX XXXX XXXX XXXX)")
    .optional()
    .default(""),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2]) \/ \d{2}$/, "Invalid format (MM / YY)")
    .optional()
    .default(""),
  cvv: z.string().length(3, "Must be 3 digits").optional().default(""),
});

const PaymentPage = () => {
  const location = useLocation();
  const course = location.state?.course;
  const [loading, setLoading] = useState(false);
  const axios=useAxios()
  const navigate=useNavigate()

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "", // Fix: Ensure empty string instead of undefined
      expiry: "",
      cvv: "",
    },
  });

  const handlePayment = async() => {
    setLoading(true);
    try {
      
      // Enroll the user in the course
      await axios.post(`/api/course/enrollment/`, { course_id: course?.id });
      toast.success("Payment successful!");
      toast.success("Successfully enrolled!");
      navigate(`/course/${course?.id}`)
    } catch (error) {
      if (error.response?.status === 401) toast.error("You are not authorized");
      else toast.error(error.response?.data?.message || "Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Formatting functions
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "") // Remove non-digits
      .replace(/(.{4})/g, "$1 ") // Add space every 4 digits
      .trim()
      .slice(0, 19); // Max 19 chars (16 digits + 3 spaces)
  };

  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, "") // Remove non-digits
      .replace(/^(\d{2})(\d{0,2})/, (_, m, y) => (y ? `${m} / ${y}` : m)) // Format MM / YY
      .slice(0, 7); // Max 7 chars (MM / YY)
  };
  return (
    <div className="max-w-lg mx-auto mt-10">
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Complete Your Enrollement</h2>
          <p className="text-gray-600 mb-4">
            You are enroll to <span className="font-semibold">{course?.title}</span>
          </p>

          
          {course?.price *(1 - course?.discount/100)!==0?(
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">

              {/* Card Number */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={field.value || ""} // Fix: Prevent undefined values
                        onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expiry Date & CVV */}
              <div className="flex gap-2">
                {/* Expiry Date */}
                <FormField
                  control={form.control}
                  name="expiry"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="MM / YY"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CVV */}
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="CVV"
                          maxLength={3}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="mt-4 w-full flex items-center gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                {loading ? "Processing..." : `${course?.price *(1 - course?.discount/100)}`}
              </Button>
            </form>
          </Form>
              ):(
              <Button type="submit" className="mt-4 w-full flex items-center gap-2" disabled={loading}
              onClick={handlePayment}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                {loading ? "Processing..." : 'Enroll Now'}
              </Button>

              )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
