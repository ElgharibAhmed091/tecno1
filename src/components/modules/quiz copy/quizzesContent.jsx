import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Schema for the entire form
const formSchema = z.object({
  title: z.string().min(1, { message: "Title Required" }),
  questions: z.array(
    z.object({
      id: z.union([z.number(), z.null()]),
      text: z.string().min(10, { message: "Question text must be at least 10 characters" }),
      type: z.enum(["single", "multi"]),
      isNew: z.boolean().default(false),
      answers: z.array(
        z.object({
          id: z.union([z.number(), z.null()]),
          text: z.string().min(1, { message: "Answer text is required" }),
          is_correct: z.boolean(),
        })
      ).min(2, { message: "At least two answers are required" })
    })
  ).min(1, { message: "At least one question is required" })
});

export default function QuizContentForm({ item, submit, deleted }) {
  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      questions: item?.questions?.map((q) => ({
        id: q.id ?? null,
        text: q.text,
        type: q.type,
        isNew: false,
        answers: q.answers.map((a) => ({
          id: a.id ?? null,
          text: a.text,
          is_correct: a.is_correct,
        }))
      })) || [
        {
          id: null,
          text: "",
          type: "single",
          isNew: true,
          answers: [
            { id: null, text: "", is_correct: true },
            { id: null, text: "", is_correct: false }
          ]
        }
      ]
    }
  });

  const { isSubmitting, isValid } = form.formState;
  const { control, handleSubmit } = form;

  // Use one field array for the questions
  const { fields: questionFields, append: addQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions",
    keyName: "formId"
  });

  // Delete question handler – note that 'deleted' is still managed in the parent
  const handleDeleteQuestion = (qIndex, questionId) => {
    if (questionId) {
      deleted.push(questionId);
    }
    removeQuestion(qIndex);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="space-y-6 p-4 border rounded-lg shadow-md">
        {/* Quiz Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiz Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter quiz title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Render each question via the QuestionItem component */}
        {questionFields.map((question, qIndex) => (
          <QuestionItem
            key={question.id ?? `question-${qIndex}`}
            control={control}
            form={form}
            question={question}
            qIndex={qIndex}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}

        {/* Button to add a new question */}
        <Button
          className="w-full bg-gray-400"
          type="button"
          onClick={() =>
            addQuestion({
              id: null,
              text: "",
              isNew: true,
              type: "single",
              answers: [
                { id: null, text: "", is_correct: true },
                { id: null, text: "", is_correct: false }
              ]
            })
          }
        >
          Add Question
        </Button>

        {/* Submit Button */}
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

// Child component for a single question item
function QuestionItem({ control, form, question, qIndex, handleDeleteQuestion }) {
  // Use a separate field array for each question's answers
  const { fields: answerFields, append: addAnswer, remove: removeAnswer } = useFieldArray({
    control,
    name: `questions.${qIndex}.answers`,
    keyName: "formId"
  });

  return (
    <div key={question.id ?? `question-${qIndex}`} className="border p-4 rounded-lg space-y-4">
      <div className="flex justify-between">
        {/* Question Type Selector */}
        <FormField
          control={form.control}
          name={`questions.${qIndex}.type`}
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <FormLabel className="pr-3">Question Type</FormLabel>
              <FormControl>
                <select {...field} className="border rounded p-2">
                  <option value="single">Single Choice</option>
                  <option value="multi">Multiple Choice</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Delete Question Button */}
        <Button
          size="sm"
          variant="ghost"
          className="text-red-500 hover:bg-red-100"
          onClick={() => handleDeleteQuestion(qIndex, question.id)}
        >
          <Trash size={16} />
        </Button>
      </div>

      {/* Question Text */}
      <FormField
        control={form.control}
        name={`questions.${qIndex}.text`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question {qIndex + 1}</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter question text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Answers for the question */}
      <div className="space-y-3">
        {answerFields.map((answer, aIndex) => (
          <div key={answer.id ?? `answer-${aIndex}`} className="flex items-center space-x-3">
            {/* Correct Answer Indicator (Radio or Checkbox) */}
            <FormField
              control={form.control}
              name={`questions.${qIndex}.answers.${aIndex}.is_correct`}
              render={({ field }) => {
                const questionType = form.watch(`questions.${qIndex}.type`);
                const answers = form.watch(`questions.${qIndex}.answers`);
                return (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      {questionType === "single" ? (
                        <RadioGroup
                          value={
                            answers.findIndex((ans) => ans.is_correct) !== -1
                              ? `${qIndex}-${answers.findIndex((ans) => ans.is_correct)}`
                              : ""
                          }
                          onValueChange={(selectedValue) => {
                            const updatedAnswers = form.getValues(`questions.${qIndex}.answers`).map((ans, index) => ({
                              ...ans,
                              is_correct: `${qIndex}-${index}` === selectedValue,
                            }));
                            form.setValue(`questions.${qIndex}.answers`, updatedAnswers);
                          }}
                        >
                          <RadioGroupItem
                            className="self-start"
                            value={`${qIndex}-${aIndex}`}
                            checked={answers[aIndex].is_correct}
                            id={`single-${qIndex}-${aIndex}`}
                          />
                        </RadioGroup>
                      ) : (
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            {/* Answer Text */}
            <FormField
              control={form.control}
              name={`questions.${qIndex}.answers.${aIndex}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Answer text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Delete Answer Button */}
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:bg-red-100"
              onClick={() => removeAnswer(aIndex)}
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
      </div>

      {/* Button to add an answer */}
      <Button
        type="button"
        className="w-full bg-gray-400"
        onClick={() => addAnswer({ id: null, text: "", is_correct: false })}
      >
        Add Answer
      </Button>
    </div>
  );
}
