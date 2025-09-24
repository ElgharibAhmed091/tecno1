import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const AdminCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axios = useAxios();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/admin/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Categories</title>
      </Helmet>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>
        <Button onClick={() => navigate("/admin/category/create")}>+ Create Category</Button>
      </div>

      {/* Table Container */}
      <Card className="overflow-hidden shadow-md rounded-lg">
        {loading ? (
          <div className="p-6 text-center">Loading categories...</div>
        ) : (
          <Table>
            {/* Table Head */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="hover:bg-gray-50 cursor-pointer transition duration-200"
                    onClick={() => navigate(`/admin/categories/${category.id}`)}
                  >
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.creator_name}</TableCell>
                    <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="p-4 text-center text-gray-500">
                    No categories found.
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

export default AdminCategoryTable;
