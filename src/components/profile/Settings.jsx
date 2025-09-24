import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription }from '@/components/ui/dialog';
import { Loader2 } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { Link } from "react-router-dom";
import useAxios from "@/utils/useAxios";

const Settings = ({user_id}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const{logoutUser}=useContext(AuthContext)
  const axios=useAxios()

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
        await axios.delete(`/api/accounts/profile/${user_id}`);
        toast.success("Account deleted successfully!");
        logoutUser()
        window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setIsOpen(false); // Close the dialog after deletion
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      {/* Change Password Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Change Password</h2>
            <p className="text-gray-600">
              Update your password to keep your account secure.
            </p>
          </div>
          <Link to='/reset/email'>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
            >
              Change Password
            </Button>
          </Link>
        </div>
      </div>

      {/* Delete Account Section */}
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Delete Account</h2>
            <p className="text-gray-600">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(true)} // Open the dialog
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <DeleteingPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isDeleting={isDeleting}
        handleClick={handleDeleteAccount}
      />
    </div>
  );
};

export default Settings;

const DeleteingPopup = ({ isOpen, setIsOpen, isDeleting, handleClick }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this account? This action cannot be undone, and all your courses will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleClick} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};