import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useAxios from '@/utils/useAxios';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns'; // Import format from date-fns

export function AssignmentsList() {
  const { courseId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({});
  const [showGradeInput, setShowGradeInput] = useState({});
  const axios = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result } = await axios.get(`/api/module/assignment/submitions/${courseId}`);
        setData(result);
      } catch {
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, axios]);

  const groupedData = data.reduce((acc, item) => {
    const module = item.modelTitle;
    if (!acc[module]) acc[module] = {};
    const assignmentId = item.assignment.id;
    if (!acc[module][assignmentId]) {
      acc[module][assignmentId] = {
        assignment: item.assignment,
        submissions: [],
      };
    }
    acc[module][assignmentId].submissions.push(item);
    return acc;
  }, {});

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGradeChange = (submissionId, value) => {
    const gradeValue = parseFloat(value);
    if (!isNaN(gradeValue)) {
      if (gradeValue >= 0 && gradeValue <= 100) {
        setGrades(prev => ({ ...prev, [submissionId]: gradeValue }));
      } else {
        toast.error('Grade must be between 0 and 100');
      }
    } else if (value === '') {
      setGrades(prev => ({ ...prev, [submissionId]: '' }));
    }
  };

  const handleSubmitGrade = async (submissionId) => {
    const grade = grades[submissionId];
    if (!grade || isNaN(grade)) {
      toast.error('Please enter a valid grade');
      return;
    }

    if (grade < 0 || grade > 100) {
      toast.error('Grade must be between 0 and 100');
      return;
    }

    try {
      await axios.patch(`/api/module/assignment/submition/grad/${submissionId}`, {
        grad: grade,
      });

      setData(prev => 
        prev.map(sub => 
          sub.id === submissionId ? { ...sub, grad: parseFloat(grade) } : sub
        )
      );

      toast.success('Grade submitted successfully');
      setShowGradeInput(prev => ({ ...prev, [submissionId]: false }));
      setGrades(prev => ({ ...prev, [submissionId]: '' })); // Clear input after submit
    } catch {
      toast.error('Failed to submit grade');
    }
  };

  const toggleGradeInput = (submissionId) => {
    setShowGradeInput(prev => ({ ...prev, [submissionId]: !prev[submissionId] }));
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      {Object.entries(groupedData).map(([moduleName, assignments]) => (
        <div key={moduleName} className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{moduleName}</h2>
          <Accordion type="single" collapsible className="w-full">
            {Object.values(assignments).map(({ assignment, submissions }) => (
              <AccordionItem key={assignment.id} value={assignment.id.toString()}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {submissions.length} submission{submissions.length !== 1 && 's'}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={submission.student.image || ''} />
                          <AvatarFallback className="bg-gray-200">
                            {submission.student.username?.[0]?.toUpperCase() ?? 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
                            onClick={() => handleDownload(submission.file, submission.file.split('/').pop())}
                          >
                            {submission.file.split('/').pop()}
                          </p>
                          <div className="text-sm text-gray-500 truncate">
                            <p>Submitted by {submission.student.username}</p>
                            {/* Date moved under student name */}
                            <p className="text-xs text-gray-400 mt-1">
                              {format(new Date(submission.submitted_at), "PP 'at' pp")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {submission.grad !== undefined && !showGradeInput[submission.id] && (
                            <div className="text-right">
                              <p className="text-sm text-gray-700">Grade: {submission.grad}/100</p>
                            </div>
                          )}

                          <Pencil
                            className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => toggleGradeInput(submission.id)}
                          />

                          {showGradeInput[submission.id] && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Grade"
                                value={grades[submission.id] || ''}
                                onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                                className="w-20"
                                min="0"
                                max="100"
                              />
                              <Button
                                onClick={() => handleSubmitGrade(submission.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Submit
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}