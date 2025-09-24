import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "@/context/AuthContext";
import { Helmet } from "react-helmet-async";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password must be at least 6 characters"),
});

const Login = () => {
  const { setAuthTokens, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };


  const loginUser = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", data);
      if (response.status === 200) {
        const tokens = response.data;
        setAuthTokens(tokens);
        localStorage.setItem("authTokens", JSON.stringify(tokens));

        const user = jwtDecode(tokens.access);
        setUser(user);

        toast.success(`Welcome back, ${user.username}!`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/accounts/auth/google/", {
        code: credentialResponse.credential,
      });

      if (response.status === 200) {
        const tokens = response.data;
        setAuthTokens(tokens);
        localStorage.setItem("authTokens", JSON.stringify(tokens));

        const user = jwtDecode(tokens.access);
        setUser(user);
        toast.success(`Welcome ${user.username}!`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Google login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex justify-center min-h-screen items-center p-6 bg-white">
      <Helmet>
        <title>Login</title>
      </Helmet>
      
      <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-8 relative border">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"
                />
              </motion.div>
            )}

            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Welcome Back
            </h1>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(loginUser)} className="space-y-6">
                <AnimatePresence>
                  {['username', 'password'].map((field, index) => (
                    <motion.div
                      key={field}
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <FormField
                        control={form.control}
                        name={field}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...formField}
                                disabled={loading}
                                type={field === 'password' ? 'password' : 'text'}
                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="flex justify-end">
                  <Link 
                    to="/reset/email" 
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || loading}
                    className="w-full h-12 text-lg font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="h-6 w-6 border-2 border-white rounded-full border-t-transparent"
                        />
                        Signing In...
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex flex-col gap-4"
            >
              <GoogleLogin
                clientId="208794677125-kft6rvf4d4eek6r1df1ln1gjhod4p68t.apps.googleusercontent.com"
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                theme="outline"
                size="large"
                shape="rectangular"
                text="continue_with"
                locale="en_US"
                auto_select={false}
              />

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;