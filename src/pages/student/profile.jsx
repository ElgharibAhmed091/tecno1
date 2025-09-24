import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";
import { useParams } from "react-router-dom";
import UserImage from "@/components/profile/userImage";
import Userinfo from "@/components/profile/userInfo";
import Settings from "../../components/profile/Settings";
import CertificationsList from "@/components/profile/certificaions";
import AuthContext from "@/context/AuthContext";
import { Helmet } from "react-helmet-async";

const UserProfile = () => {
  const [userData, setUserData] = useState({ username: "", email: "", role: "", image: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const {user_id}=useParams()
  const{user}=useContext(AuthContext)
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
        try {
          const response = await axiosInstance.get(`api/accounts/profile/${user_id}`);
          setUserData(response.data);
        } catch {
          toast.error("Failed to fetch profile data");
        } finally {
          setLoading(false);
        }
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6 space-y-8">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      {/* Header Section */}
      <div className="flex flex-col items-center pb-6 relative">
        <UserImage userData={userData} setUserData={setUserData} user_id={user_id}/>
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold">{userData.username}</h1>
          <p className="text-gray-500">{userData.role}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-6 border-b pb-3">
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-2 px-4 ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-2 px-4 ${activeTab === "settings" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Settings
        </button>
        {
          user.role==='student'?(

          <button
            onClick={() => setActiveTab("Certificaitons")}
            className={`py-2 px-4 ${activeTab === "settings" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
          >
            Certificaitons
          </button>
          ):null
        }
        
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profile" && !loading && (
          <div className="space-y-4">
            <Userinfo  userData={userData} setUserData={setUserData} user_id={user_id}/>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <Settings user_id={user_id}/>
          </div>
        )}

        {activeTab === "Certificaitons" && (
          <div>
            <CertificationsList/>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
