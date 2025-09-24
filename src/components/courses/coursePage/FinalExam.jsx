import { useState, useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";

const FinalExam = ({ courseId }) => {
  const axios = useAxios();
  const [finalGrade, setFinalGrade] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const methods = useForm();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await axios.get(`api/finalExams/student`, {
          params: { courseId }
        });
        if (data.length > 0) {
          setExam(data[0]);
          methods.reset({
            questions: data[0].questions.reduce((acc, q) => {
              acc[q.id] = q.type === "multiple" ? [] : "";
              return acc;
            }, {})
          });
        }
      } catch (error) {
        toast.error("Failed to load exam");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [courseId]);

  const calculateGrade = useCallback((userAnswers) => {
    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    exam.questions.forEach((question) => {
      const correctIds = question.answers
        .filter(a => a.is_correct)
        .map(a => String(a.id));
      const userSelected = Array.isArray(userAnswers[question.id]) 
        ? userAnswers[question.id] 
        : [userAnswers[question.id]];

      if (correctIds.length === userSelected.length && 
          correctIds.every(id => userSelected.includes(id))) {
        correctCount++;
      }
    });

    return parseFloat(((correctCount / totalQuestions) * 100).toFixed(2));
  }, [exam?.questions]);

  const onSubmit = async (data) => {
    try {
      const unanswered = exam.questions.filter(question => {
        const value = data.questions[question.id];
        return !value || (Array.isArray(value) && value.length === 0);
      });

      if (unanswered.length > 0) {
        toast.error("Please answer all questions before submitting");
        return;
      }

      const grade = calculateGrade(data.questions);
      setFinalGrade(grade);
      setIsSubmitted(true);
      await axios.post(`api/finalExam/submit/${exam.id}`, { 
        examId:exam.id,
        grade: grade
      });
      
      toast.success(`Exam submitted successfully! Score: ${grade}%`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    }
  };

  const handleRetake = () => {
    methods.reset();
    setFinalGrade(null);
    setIsSubmitted(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  if (!exam?.questions?.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <p className="text-gray-500 text-center">No exam available for this course</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit)} 
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">{exam.title}</h1>

        <div className="space-y-8">
          {exam.questions.map((question) => (
            <div 
              key={question.id} 
              className="p-4 bg-gray-50 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold mb-4">
                {question.text}
              </h3>

              {question.type === "single" ? (
                <RadioGroup 
                  className="space-y-2"
                  value={methods.watch(`questions.${question.id}`) || ""}
                  onValueChange={(value) => methods.setValue(`questions.${question.id}`, value)}
                  disabled={isSubmitted}
                >
                  {question.answers.map((answer) => (
                    <div 
                      key={answer.id} 
                      className="flex items-center space-x-3 p-2 rounded-md transition-colors hover:bg-gray-100"
                    >
                      <RadioGroupItem 
                        value={String(answer.id)} 
                        id={`q${question.id}_a${answer.id}`}
                      />
                      <label 
                        htmlFor={`q${question.id}_a${answer.id}`} 
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {answer.text}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {question.answers.map((answer) => {
                    const currentValues = methods.watch(`questions.${question.id}`) || [];
                    const isSelected = currentValues.includes(String(answer.id));

                    return (
                      <div 
                        key={answer.id} 
                        className="flex items-center space-x-3 p-2 rounded-md transition-colors hover:bg-gray-100"
                      >
                        <Checkbox
                          id={`q${question.id}_a${answer.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (!isSubmitted) {
                              const updatedValues = checked
                                ? [...currentValues, String(answer.id)]
                                : currentValues.filter(id => id !== String(answer.id));
                              methods.setValue(`questions.${question.id}`, updatedValues);
                            }
                          }}
                          disabled={isSubmitted}
                        />
                        <label 
                          htmlFor={`q${question.id}_a${answer.id}`} 
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {answer.text}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {finalGrade ? (
          <div className="mt-6 text-center">
            <div className="text-xl font-bold text-blue-600 mb-4">
              Final Grade: {finalGrade}%
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleRetake}
            >
              Retake Exam
            </Button>
          </div>
        ) : (
          <Button 
            type="submit" 
            className="w-full mt-8" 
            disabled={methods.formState.isSubmitting || isSubmitted}
          >
            {methods.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Exam"
            )}
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default FinalExam;