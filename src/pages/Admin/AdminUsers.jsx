import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axios = useAxios();
  const [blacklist, setBlacklist] = useState(1); // Default: Show active users

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/accounts/admin/users");
        setUsers(response.data);
      } catch {
        toast.error("Something went wrong...");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Users</title>
      </Helmet>

      {/* Active and Blacklist Users Toggle */}
      <div className="flex gap-4 mb-4">
        <Button
          className={cn(
            "flex rounded-sm text-black bg-slate-300/20 hover:bg-slate-700/20 hover:text-black",
            blacklist === 1 && "text-white bg-black"
          )}
          onClick={() => setBlacklist(1)}
        >
          Active Users
        </Button>
        <Button
          className={cn(
            "flex rounded-sm text-black bg-slate-300/20 hover:bg-slate-700/20 hover:text-black",
            blacklist === 0 && "text-white bg-black"
          )}
          onClick={() => setBlacklist(0)}
        >
          Blacklist
        </Button>
      </div>

      {/* Table Container */}
      <Card className="overflow-hidden shadow-md rounded-lg rounded-t-none">
        {loading ? (
          <div className="p-6 text-center">Loading users...</div>
        ) : (
          <Table>
            {/* Table Head */}
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined At</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Is Active</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {users.filter((user) => user.is_active == blacklist).length > 0 ? (
                users
                  .filter((user) => user.is_active == blacklist)
                  .map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer transition duration-200"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.date_joined).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(user.last_login).toLocaleDateString()}</TableCell>
                      <TableCell>{user.is_active ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="p-4 text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AdminUsersTable;
