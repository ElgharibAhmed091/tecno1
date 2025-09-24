import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }).min(1, {
      message: "Email is required",
    }),
});

export const RequestResetPassword = () => {
    const navigate = useNavigate();
    const [sended, setSended] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/accounts/reset/request`, values);
            setSended(true); // Show success message
        } catch {
            toast.error('Something went wrong');
            navigate('/');
        }
    };

    return (
        <div className="flex justify-center items-center pt-8">
        <Helmet>
            <title>Reset Password</title>
        </Helmet>
            {sended ? (
                <Card className="max-w-md w-full bg-white shadow-lg border rounded-lg p-6">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-center">Check Your Email</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 text-center">
                            A reset password email has been sent to your email address. Please check your inbox and click the link to reset your password.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="max-w-md w-full bg-white shadow-lg border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-center">Reset Password</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="example@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between">
                                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Reset"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default RequestResetPassword;
