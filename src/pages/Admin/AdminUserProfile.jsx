import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trash2, Ban, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const AdminUserDetailPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBlacklist, setOpenBlacklist] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/accounts/admin/user/${userId}`);
        setUser(response.data);
      } catch(error) {
        if (error.status==401)navigate('/')
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleBlacklistToggle = async () => {
    try {
      const newStatus = user.is_active ? 0 : 1;
      await axios.patch(`/api/accounts/admin/user/${userId}`, { is_active: newStatus });
      setUser((prev) => ({ ...prev, is_active: Boolean(newStatus) }));
      toast.success(`User ${user.is_active ? "blacklisted" : "Activated"} successfully`);
    } catch {
      toast.error("Failed to update user status");
    }
    setOpenBlacklist(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/accounts/admin/user/${userId}`);
      toast.success("User deleted successfully");
      navigate(-1);
    } catch {
      toast.error("Failed to delete user");
    }
    setOpenDelete(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>User</title>
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant={user.is_active ? "destructive" : "default"} onClick={() => setOpenBlacklist(true)}>
            <Ban className="h-4 w-4 mr-2" /> {user.is_active ? "Blacklist User" : "Activate User"}
          </Button>
          <Button variant="destructive" onClick={() => setOpenDelete(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-center">{user.username}</h2>
          <p className="text-sm text-gray-500 text-center">{user.email}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
            <p className="text-left font-medium">Role:</p>
            <p className="text-center">{user.role}</p>

            <p className="text-left font-medium">Joined:</p>
            <p className="text-center">{new Date(user.date_joined).toLocaleDateString()}</p>

            <p className="text-left font-medium">Last Login:</p>
            <p className="text-center">{user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</p>

            <p className="text-left font-medium">Status:</p>
            <p className={`text-center font-semibold ${user.is_active ? "text-green-600" : "text-red-600"}`}>
              {user.is_active ? "Active" : "Blacklisted"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Blacklist Confirmation Dialog */}
      <Dialog open={openBlacklist} onOpenChange={setOpenBlacklist}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {user.is_active ? "Blacklist" : "Activate"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {user.is_active ? "blacklist" : "Activate"} this user? They will {user.is_active ? "no longer" : "again"} be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenBlacklist(false)}>Cancel</Button>
            <Button variant={user.is_active ? "destructive" : "default"} onClick={handleBlacklistToggle}>
              {user.is_active ? "Blacklist" : "Whitelist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user.username}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserDetailPage;
