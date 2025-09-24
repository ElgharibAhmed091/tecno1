import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import QuizContentForm from "./quizzesContent";


const QuizForm = ({ open, setOpen, moduleId, order,setModule,item,disabled}) => {
  const axios = useAxios();
  let deleted=[]
  const handleQuiz = async (values) => {
    try {
        let response;
        if (!item?.id) {  
          //if create
            response = await axios.post("api/module/quiz/create", {
                module: moduleId,
                order: order + 1,
                ...values
            });

            //update it localy 
            setModule(prevModule => ({
              ...prevModule,
              quizzes: [...(prevModule?.quizzes || []), response.data]
          }));

            toast.success("Quiz added successfully");

        }
        else {
          // if update
          let created=[]
          let updated=[]
          values.questions.forEach((q) => {
            if (q.isNew) {
              created.push({
                text: q.text,
                type:q.type,
                answers:q.answers.map(a=>({text:a.text,is_correct:a.is_correct}))
              })
            }
            else {
              // Add existing questions to the 'updated' list
              updated.push({
                id:q.id,
                text: q.text,
                type: q.type,
                answers: q.answers.map(ans => ({
                  id: ans.id,
                  text: ans.text,
                  is_correct: ans.is_correct
                }))
              });
            }
          })
            response = await axios.put(`api/module/quiz/${item.id}/action`, {
                module: moduleId,
                order:item.order,
                title:values.title,
                created:created,
                deleted:deleted,
                updated:updated
            });
            const updatedQuiz = response.data;
            deleted=[]
            setModule((prev) => {
                const newModule = {
                    ...prev,
                    quizzes: prev.quizzes.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q))
                };
                return newModule;
            });

            toast.success("Quiz edited successfully");
        }
      }
    catch (error) {
        console.error("Error Occurred:", error);
        toast.error("Failed to add Quiz");
    }
    finally{
      setOpen(null);
    }
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)} >
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Quiz</DialogTitle>
          <DialogDescription>
                please fill the form below
          </DialogDescription>
        </DialogHeader>
        <QuizContentForm item={item} submit={handleQuiz} deleted={deleted} disabled={disabled}/>
        <Button onClick={()=>{setOpen(null);}}>
          cancle
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default QuizForm;
