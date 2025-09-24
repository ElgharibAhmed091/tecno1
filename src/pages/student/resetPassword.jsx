import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Validation schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");

const userSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Signup Component
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const{token}=useParams()
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
        await axios.patch(`http://127.0.0.1:8000/api/accounts/reset/response/${token}`, values);
        toast.success("the password updated!");
        setTimeout(()=>navigate('/login'))
    } catch (e){
        if(e.status===404){
            toast.error('Not Found');
            navigate('/')
        }
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center h-full p-6">
      <Helmet>
          <title>Reset Password</title>
      </Helmet>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={loading} placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={loading} placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "submiting..." : "reset"}
                </Button>
              </form>
            </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
