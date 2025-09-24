import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import CategoryTitleForm from "@/components/category/categoryTitleForm";
import { Helmet } from "react-helmet-async";

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axios = useAxios();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`/api/admin/categories/${categoryId}/`);
        setCategory(response.data);
      } catch {
        toast.error('failed to get the category')
            } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId]);


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>Category</title>
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CategoryTitleForm initialData={category} categoryId={categoryId} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mt-2">Created by: {category.creator_name}</p>
          <p className="text-sm text-gray-500">Created at: {new Date(category.created_at).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDetailPage;
