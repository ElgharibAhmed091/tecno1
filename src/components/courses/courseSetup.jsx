import { TitleForm } from "@/components/courses/Course_Forms/titleForm";
import { DescriptionForm } from "@/components/courses/Course_Forms/descriptionForm";
import ImageForm from "@/components/courses/Course_Forms/image-form";
import CategoryForm from "@/components/courses/Course_Forms/categoryForm";
import PriceForm from "@/components/courses/Course_Forms/priceForm";
import HoursForm from "./Course_Forms/hoursForm";
import LearnedForm from "./Course_Forms/learendForm";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import DiscountForm from "./Course_Forms/discoundForm";
import LanguageForm from "./Course_Forms/LanguageForm";


export const CourseSetup = ({ course, categories, setCourse }) => {

  const axios=useAxios()
  const handlePublish = async (value) => {
    try {
        const response = await axios.patch(`/api/instructor/course/${course?.id}/`,value);
        toast.success('Course updated');
        setCourse(response.data)
    } catch {
        toast.error('Something went wrong');
    }
};
const requiredFields = ["title", "description", "category", "price", "image",'language','hours'];
const completedCount = requiredFields.filter((field) => course[field]).length;
const isPublishable = completedCount === requiredFields.length;


  return (
    <>
      <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2 w-full">
        <h1 className="text-2xl font-medium">Course setup</h1>
        <span>Completed ({completedCount}/{requiredFields.length})</span>
      </div>

      {course.published ? (
        !course.completed && (
          <div className="flex justify-end">
            <Button
              className="w-full"
              onClick={() => handlePublish({ completed: true })}
            >
              Mark as Completed
            </Button>
          </div>
        )
      ) : (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={course.modules.length === 0 || !isPublishable}
          onClick={() => handlePublish({ published: true })}
        >
          <CheckCircle className="h-5 w-5" />
          Publish
        </Button>
      )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course?.id} setInitial={setCourse} />
          <DescriptionForm initialData={course} courseId={course?.id} setInitial={setCourse} />

          {categories.length > 0 && (
            <CategoryForm
              initialData={course}
              courseId={course?.id}
              setInitial={setCourse}
              options={categories?.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          )}
          <ImageForm initialData={course} courseId={course?.id} setInitial={setCourse} />
        </div>
        <div className="space-y-6 mt-4">
          <LanguageForm initialData={course} courseId={course?.id} setInitial={setCourse} />
          <PriceForm initialData={course} courseId={course?.id} setInitial={setCourse} />
          <DiscountForm initialData={course} courseId={course?.id} setInitial={setCourse} />
          <HoursForm initialData={course} courseId={course?.id} setInitial={setCourse} />
          <LearnedForm initialData={course} courseId={course?.id} setInitial={setCourse} />
        </div>
      </div>
    </>
  );
};

  
export default CourseSetup;
