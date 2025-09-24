import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext, useMemo } from "react";
import AuthContext from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const baseURL = "http://127.0.0.1:8000";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } = useContext(AuthContext);
  const navigate=useNavigate()

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${authTokens?.access}` },
    });

    instance.interceptors.request.use(async (req) => {
      if (!authTokens) return req;
      if(!authTokens?.refresh){
        logoutUser();
        navigate('/login')
      }

      const user = jwtDecode(authTokens.access);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) return req;

      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: authTokens.refresh,
        });
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        req.headers.Authorization = `Bearer ${response.data.access}`;
      } catch  {
        logoutUser();
        navigate('/login')
      }

      return req;
    });
    //status code handeler for the response
    instance.interceptors.response.use(
      (response)=>response,
      (error)=>{
        if(!error.response){
          toast.error('Network error,Please check your connection and try again later')
        }
      const {status}=error.response
      if (status===401){
        toast.error('Session expired. Please log in again')
      }
      else if(status===403)toast.error("You don't have permission to access this resource.");
      else if (status === 404) {
        toast.error("Resource not found.");
      }
      else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      }
      else {
        toast.error("An unexpected error occurred.");
      }
      return Promise.reject(error);
      }
      
    )


    return instance;
  }, [authTokens, setAuthTokens, setUser, logoutUser]);

  return axiosInstance;
};

export default useAxios;
