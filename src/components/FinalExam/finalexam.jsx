import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '@/utils/useAxios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function FinalExamEditor() {
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState({
    title: '',
    course: courseId,
    questions: []
  });
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await axios.get(`/api/finalExams/instructor`, {
          params: { courseId }
        });
        if (data){
          setExam(data[0]);
        }
      } catch {
        toast.success('No existing exam found, creating new');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [courseId, axios]);

  const handleExamSave = async () => {
    setIsLoading(true);
    try {
      const endpoint = exam.id ? `/api/finalExam/instructor/${exam.id}` : '/api/finalExams/instructor';
      const method = exam.id ? 'put' : 'post';

      const examResponse = await axios[method](endpoint, { course: courseId });
      
      for (const question of exam.questions) {
        const qEndpoint = question.id ? `/api/finalExam/question/${question.id}` : '/api/finalExam/questions/';
        const qMethod = question.id ? 'put' : 'post';
        
        const questionResponse = await axios[qMethod](qEndpoint, {
          text: question.text,
          type: question.type,
          exam: examResponse.data.id
        });

        for (const answer of question.answers) {
          const aEndpoint = answer.id ? `/api/finalExam/Answer/${answer.id}` : '/api/finalExam/answers/';
          const aMethod = answer.id ? 'put' : 'post';

          await axios[aMethod](aEndpoint, {
            text: answer.text,
            is_correct: answer.is_correct,
            question: questionResponse.data.id
          });
        }
      }

      toast.success('Exam saved successfully!');
    } catch (error) {
      toast.error(`Failed to save exam: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index][field] = value;
    setExam(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAnswerChange = (qIndex, aIndex, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[qIndex].answers[aIndex][field] = value;
    setExam(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setExam(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          type: 'single',
          answers: [{ text: '', is_correct: true }]
        }
      ]
    }));
  };

  const addAnswer = (qIndex) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[qIndex].answers.push({ text: '', is_correct: false });
    setExam(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const deleteQuestion = async (qIndex, questionId) => {
    if (questionId) {
      try {
        await axios.delete(`/api/finalExam/question/${questionId}`);
      } catch {
        toast.error('Failed to delete question');
        return;
      }
    }
    
    const updatedQuestions = exam.questions.filter((_, idx) => idx !== qIndex);
    setExam(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const deleteAnswer = async (qIndex, aIndex, answerId) => {
    if (answerId) {
      try {
        await axios.delete(`/api/finalExam/Answer/${answerId}`);
      } catch {
        toast.error('Failed to delete answer');
        return;
      }
    }
    
    const updatedQuestions = [...exam.questions];
    updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter((_, idx) => idx !== aIndex);
    setExam(prev => ({ ...prev, questions: updatedQuestions }));
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <Button 
          onClick={handleExamSave}
          className="gap-2 transition-all hover:scale-[1.02] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Save className="h-5 w-5 text-white" />
          )}
          {isLoading ? "Saving..." : "Save Exam"}
        </Button>
      </div>

      <div className="space-y-6">
        {exam?.questions?.map((question, qIndex) => (
          <motion.div 
            key={qIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-semibold text-gray-800">
                Question {qIndex + 1}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteQuestion(qIndex, question.id)}
                className="text-red-600 hover:bg-red-50/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Input
              value={question.text}
              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
              placeholder="Enter question text"
              className="mb-4 text-gray-700"
            />

            <div className="flex gap-4 mb-4">
              <select
                value={question.type}
                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single Choice</option>
                <option value="multi">Multiple Choice</option>
              </select>
            </div>

            <div className="space-y-3">
              {question.answers.map((answer, aIndex) => (
                <div key={aIndex} className="flex items-center gap-3">
                  <input
                    type={question.type === 'single' ? 'radio' : 'checkbox'}
                    name={`question-${qIndex}`}
                    checked={answer.is_correct}
                    onChange={(e) => handleAnswerChange(qIndex, aIndex, 'is_correct', e.target.checked)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Input
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(qIndex, aIndex, 'text', e.target.value)}
                    placeholder={`Answer ${aIndex + 1}`}
                    className="flex-1 text-gray-700"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAnswer(qIndex, aIndex, answer.id)}
                    className="text-red-600 hover:bg-red-50/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => addAnswer(qIndex)}
              className="mt-4 gap-2 w-full hover:bg-gray-50/50 border-gray-200"
            >
              <PlusCircle className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">Add Answer</span>
            </Button>
          </motion.div>
        ))}
      </div>

      <Button 
        onClick={addQuestion} 
        className="w-full mt-6 gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
      >
        <PlusCircle className="h-5 w-5" />
        Add New Question
      </Button>
    </div>
  );
}