import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { CoursesList } from "@/components/courses/courses-list";
import { Categories } from "@/components/courses/searchCategory";
import toast from "react-hot-toast";
import SearchInput from "@/components/courses/search-input";
import { Helmet } from "react-helmet-async";

const CoursesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null); // Stores next page URL
  const loadingMoreRef = useRef(false); // Prevent multiple requests

  // Fetch initial courses and categories
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        let url = "http://127.0.0.1:8000/api/courses/";
        if (queryParams.toString()) url += `?${queryParams.toString()}`;

        const response = await axios.get(url);
        const newCourses = response.data.results || response.data;

        setCourses(newCourses);
        setNextPage(response.data.next || null);

        if (categories.length === 0) {
          const response2 = await axios.get("http://127.0.0.1:8000/api/categories/");
          setCategories(response2.data);
        }
      } catch {
        toast.error("Something went wrong...");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [location.search, navigate]);

  // Function to fetch more courses when scrolling to bottom
  const fetchMoreCourses = async () => {
    if (!nextPage || loadingMoreRef.current) return;
    loadingMoreRef.current = true; // Mark as loading

    try {
      const response = await axios.get(nextPage);
      const newCourses = response.data.results || response.data;

      // Prevent duplicate courses
      setCourses((prevCourses) => {
        const existingIds = new Set(prevCourses.map((course) => course.id));
        const filteredNewCourses = newCourses.filter((course) => !existingIds.has(course.id));
        return [...prevCourses, ...filteredNewCourses];
      });

      setNextPage(response.data.next || null);
    } catch {
      toast.error("Failed to load more courses");
    } finally {
      loadingMoreRef.current = false; // Allow next request
    }
  };

  // Improved Scroll Event Handler with Debouncing
  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      if (timeout) clearTimeout(timeout); 

      timeout = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
          fetchMoreCourses();
        }
      }, 300); // Debounce time
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [nextPage]);

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
        ))}
      </div>
    );

  return (
    <>
      <Helmet>
            <title>Courses</title>
      </Helmet>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="pt-5 pl-4 border-b-[1px] border-slate-200">
        <Categories items={categories} />
      </div>
      <div className="p-6">
        <CoursesList items={courses} link={'/courses/'} />
        {loadingMoreRef.current && <p className="text-center mt-4">Loading more courses...</p>}
      </div>
    </>
  );
};

export default CoursesPage;
