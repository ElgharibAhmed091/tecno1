import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Helmet } from "react-helmet-async";
import { Check, Loader2, X } from "lucide-react";

// Debounce utility
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Validation schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");
  
  const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const location = useLocation();
  const { setAuthTokens, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const userSchema = z.object({
    firstName: z.string()
      .min(1, "First name is required")
      .max(50, "First name too long")
      .regex(/^[A-Za-z]+$/, "Should contain only letters"),
    lastName: z.string()
      .min(1, "Last name is required")
      .max(50, "Last name too long")
      .regex(/^[A-Za-z]+$/, "Should contain only letters"),
    username: z.string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^\S+$/, "Username cannot contain spaces"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }).refine(() => usernameAvailable, {
    message: "Username already taken",
    path: ["username"],
  });

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Username availability check
  const checkUsernameAvailability = async (username) => {
    try {
      setCheckingUsername(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/accounts/username/check",
        { params: { username } }
      );
      setUsernameAvailable(!response.data.exists);
    } catch  {
      toast.error("Error checking username availability");
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const debouncedCheckUsername = debounce(checkUsernameAvailability, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "username") {
        const username = value.username;
        if (username.length >= 3 && /^\S+$/.test(username)) {
          debouncedCheckUsername(username);
        } else {
          setUsernameAvailable(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
      };

      if (location.pathname?.startsWith('/teacher')) {
        payload.role = 'instructor';
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/signup/",
        payload
      );

      if (response.status === 201) {
        toast.success("Verification email sent!");
        setEmailSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    const googleToken = credentialResponse.credential;
    const role = location.pathname?.startsWith('/teacher') ? 'instructor' : '';
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/accounts/auth/google/", {
        code: googleToken,
        role: role
      });

      if (response.status === 200) {
        const tokens = response.data;
        setAuthTokens(tokens);
        localStorage.setItem("authTokens", JSON.stringify(tokens));
        const user = jwtDecode(tokens.access);
        setUser(user);
        toast.success("Logged in with Google");
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Signup with Google failed");
  };

  useEffect(() => {
    if (usernameAvailable === false) {
      form.setError('username', {
        type: 'manual',
        message: 'Username is already taken'
      });
    } else {
      form.clearErrors('username');
    }
  }, [usernameAvailable, form]);
  
  return (
    <div className="w-full flex justify-center min-h-screen items-center p-6 bg-white">
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      
      <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-8 relative border">
        <AnimatePresence mode="wait">
          {emailSent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4 text-blue-600"
                  >
                    ✉️
                  </motion.div>
                  <h2 className="text-2xl font-bold text-blue-600">
                    Check Your Email
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    We&apos;ve sent a verification link to your email. Click it to activate your account.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => navigate('/')}
                    >
                      Return Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center"
                    >
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    </motion.div>
                  )}

                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  {location.pathname?.startsWith('/teacher') ? 'Teach With Us' : 'Create Account'}
                </h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <AnimatePresence>
                      {['firstName', 'lastName', 'username'].map((field, index) => (
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
                                  {field.replace(/([A-Z])/g, ' $1').trim()}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...formField}
                                      disabled={loading}
                                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                      type={field.includes('password') ? 'password' : 'text'}
                                      // Add username-specific logic
                                      {...(field === 'username' && {
                                        onChange: (e) => {
                                          formField.onChange(e);
                                          setUsernameAvailable(null);
                                        }
                                      })}
                                    />
                                    {/* Show icons only for username field */}
                                    {field === 'username' && (
                                      <div className="absolute right-3 top-3">
                                        {checkingUsername ? (
                                          <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                                        ) : usernameAvailable === true ? (
                                          <Check className="h-5 w-5 text-green-500" />
                                        ) : usernameAvailable === false ? (
                                          <X className="h-5 w-5 text-red-500" />
                                        ) : null}
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                              <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      ))}
                       <motion.div
                          key={'email'}
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.3 }}
                        >
                          <FormField
                            control={form.control}
                            name={'email'}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      disabled={loading}
                                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                      type='email'
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                       <motion.div
                          key={'password'}
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.3 }}
                        >
                          <FormField
                            control={form.control}
                            name={'password'}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      disabled={loading}
                                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                      type='password'
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                       <motion.div
                          key={'confirmPassword'}
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.3 }}
                        >
                          <FormField
                            control={form.control}
                            name={'confirmPassword'}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                Confirm Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      disabled={loading}
                                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                      type='password'
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                    </AnimatePresence>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Button
                        type="submit"
                        disabled={ loading || usernameAvailable === false}
                        className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                      >
                       {loading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-6 w-6 animate-spin text-white" />
                              Creating Account...
                            </div>
                          ) : (
                            "Create Account"
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
                  className="flex justify-center"
                >
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onFailure={handleGoogleFailure}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="signup_with"
                    locale="en_US"
                    auto_select={false}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signup;