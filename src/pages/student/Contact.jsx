import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ContactUs() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/support/contact-us/', data);
      toast.success('The email has been sent');
      reset();
    } catch (error) {
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto p-6 md:p-12 bg-white shadow-lg rounded-2xl dark:bg-gray-900">
      <Helmet>
        <title>Contact us</title>
      </Helmet>
      {/* Left Section: Contact Info */}
      <div className="w-full md:w-2/5 p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Get in Touch</h2>
        <p className="text-gray-600 dark:text-gray-300">We’d love to hear from you. Fill out the form or reach us via the details below.</p>
        
      </div>
      
      {/* Right Section: Contact Form */}
      <div className="w-full md:w-3/5 p-6">
        <form onSubmit={handleSubmit((data) => {
          // Show errors as toast notifications
          if (errors.name) toast.error(errors.name.message);
          if (errors.email) toast.error(errors.email.message);
          if (errors.message) toast.error(errors.message.message);
          
          onSubmit(data);
        })} className="space-y-4">
          <input {...register("name", { required: "Name is required" })} placeholder="Your Name" className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white" />
          
          <input {...register("email", { 
            required: "Email is required", 
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } 
          })} placeholder="Your Email" className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white" />
          
          <textarea {...register("message", { required: "Message is required" })} placeholder="Your Message" className="w-full p-3 border rounded-lg h-32 dark:bg-gray-800 dark:text-white"></textarea>
          
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
