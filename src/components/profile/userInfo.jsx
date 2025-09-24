import { useState, useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";

const UserInfo = ({ userData, setUserData, user_id }) => {
  const axiosInstance = useAxios();
  const [isChanged, setIsChanged] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Store the original data when the component mounts
  useEffect(() => {
    setOriginalData({
      first_name: userData.first_name,
      last_name: userData.last_name,
    });
  }, [userData]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // Enable "Save" button if there's a change
    setIsChanged(
      e.target.value !== originalData[e.target.name]
    );
  };

  const handleSave = async () => {
    try {
      await axiosInstance.patch(`api/accounts/profile/${user_id}`, {
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
      toast.success("Profile updated successfully!");

      // Reset original data and disable the button
      setOriginalData({
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
      setIsChanged(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Read-Only Fields */}
        <div>
          <Label>Username</Label>
          <Input value={userData.username} readOnly className="bg-gray-100" />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={userData.email} readOnly className="bg-gray-100" />
        </div>

        {/* Editable Fields */}
        <div>
          <Label>First Name</Label>
          <Input name="first_name" value={userData.first_name} onChange={handleChange} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="last_name" value={userData.last_name} onChange={handleChange} />
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full" disabled={!isChanged}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
