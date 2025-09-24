import { useState, useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";

const QuizShow = ({ quiz }) => {
  const axios = useAxios();
  const [submittedAnswers, setSubmittedAnswers] = useState(null);
  const [finalGrade, setFinalGrade] = useState(null);
  useEffect(() => {
    setSubmittedAnswers(null);
    setFinalGrade(null);
  }, [quiz]);

  const methods = useForm({
    defaultValues: {
      questions: Object.fromEntries(
        (quiz?.questions?.map(q => [
          q.id, 
          q.type === "multi" ? [] : ""
        ]) || [])
      )
    },
  });

  const calculateGrade = useCallback((userAnswers) => {
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question) => {
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

    return ((correctCount / totalQuestions) * 100).toFixed(2);
  }, [quiz.questions]);

  const onSubmit = async (data) => {
    try {
      const unanswered = quiz.questions.filter(question => {
        const value = data.questions[question.id];
        return !value || (Array.isArray(value) && value.length === 0);
      });

      if (unanswered.length > 0) {
        toast.error("Please answer all questions before submitting");
        return;
      }

      const grade = calculateGrade(data.questions);
      setSubmittedAnswers(data.questions);
      setFinalGrade(grade);

      await axios.post("api/module/quiz/grad", { 
        quiz: quiz.id, 
        grad: grade 
      });
      
      toast.success(`Quiz graded successfully! Score: ${grade}%`);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Grading failed");
    }
  };

  const handleRetake = () => {
    methods.reset();
    setSubmittedAnswers(null);
    setFinalGrade(null);
  };

  if (!quiz?.questions?.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <p className="text-gray-500 text-center">No questions available</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit)} 
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">{quiz.title}</h1>

        <div className="space-y-8">
          {quiz.questions.map((question) => {
            const correctAnswers = question.answers
              .filter(a => a.is_correct)
              .map(a => String(a.id));

            return (
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
                    value={
                      submittedAnswers 
                        ? submittedAnswers[question.id]
                        : methods.watch(`questions.${question.id}`)
                    }
                    onValueChange={(value) => methods.setValue(`questions.${question.id}`, value)}
                    disabled={!!submittedAnswers}
                  >
                    {question.answers.map((answer) => {
                      const isCorrect = answer.is_correct;
                      const isSelected = submittedAnswers
                        ? submittedAnswers[question.id] === String(answer.id)
                        : methods.watch(`questions.${question.id}`) === String(answer.id);
                      const isWrong = isSelected && !isCorrect;

                      return (
                        <div 
                          key={answer.id} 
                          className={`flex items-center space-x-3 p-2 rounded-md transition-colors
                            ${submittedAnswers && isCorrect ? "bg-green-100/80" : ""}
                            ${submittedAnswers && isWrong ? "bg-red-100/80" : ""}
                            ${!submittedAnswers ? "hover:bg-gray-100" : ""}`}
                        >
                          <RadioGroupItem 
                            value={String(answer.id)} 
                            id={`q${question.id}_a${answer.id}`}
                            aria-invalid={isWrong}
                          />
                          <label 
                            htmlFor={`q${question.id}_a${answer.id}`} 
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {answer.text}
                            {submittedAnswers && isCorrect && (
                              <span className="ml-2 text-green-600">✅ (Correct answer)</span>
                            )}
                            {submittedAnswers && isWrong && (
                              <span className="ml-2 text-red-600">❌ (Your selection)</span>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {question.answers.map((answer) => {
                      const isCorrect = answer.is_correct;
                      const currentValues = submittedAnswers
                        ? submittedAnswers[question.id]
                        : methods.watch(`questions.${question.id}`) || [];
                      const isSelected = currentValues.includes(String(answer.id));
                      const isWrong = isSelected && !isCorrect;

                      return (
                        <div 
                          key={answer.id} 
                          className={`flex items-center space-x-3 p-2 rounded-md transition-colors
                            ${submittedAnswers && isCorrect ? "bg-green-100/80" : ""}
                            ${submittedAnswers && isWrong ? "bg-red-100/80" : ""}
                            ${!submittedAnswers ? "hover:bg-gray-100" : ""}`}
                        >
                          <Checkbox
                            id={`q${question.id}_a${answer.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (!submittedAnswers) {
                                const currentValues = methods.getValues(`questions.${question.id}`) || [];
                                methods.setValue(
                                  `questions.${question.id}`,
                                  checked 
                                    ? [...currentValues, String(answer.id)] 
                                    : currentValues.filter(id => id !== String(answer.id))
                                );
                              }
                            }}
                            disabled={!!submittedAnswers}
                            aria-invalid={isWrong}
                          />
                          <label 
                            htmlFor={`q${question.id}_a${answer.id}`} 
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {answer.text}
                            {submittedAnswers && isCorrect && (
                              <span className="ml-2 text-green-600">✅ (Correct answer)</span>
                            )}
                            {submittedAnswers && isWrong && (
                              <span className="ml-2 text-red-600">❌ (Your selection)</span>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {finalGrade && (
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
              Retake Quiz
            </Button>
          </div>
        )}

        {!submittedAnswers && (
          <Button 
            type="submit" 
            className="w-full mt-8" 
            disabled={methods.formState.isSubmitting}
          >
            {methods.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Answers"
            )}
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default QuizShow;