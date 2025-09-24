import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://127.0.0.1:8000/api/accounts/verify_email/${token}`);

        toast.success("Your email has been verified successfully!");
        setTimeout(() => navigate("/login"), 1000);
      } catch {
        toast.error("Invalid or expired token.");
        setTimeout(() => navigate("/"), 1000);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold text-gray-700">Redirecting...</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;
