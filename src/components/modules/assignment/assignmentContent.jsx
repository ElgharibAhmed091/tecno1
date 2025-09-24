import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { memo } from "react";
import AssignmentForm from "./assignmentForm";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";

const AssignmentPobup = ({ open, setOpen,item,module_id,setModule,disabled}) => {
  const axios=useAxios()
  const onSubmit = async (data) => {
    try {
      const payload = { ...data, module: module_id, due_date: data.due_date.toISOString()};

      if (item) {
        let response=await axios.patch(`/api/module/assignment/${item?.id}/action`, payload);
        setModule((prev)=>({
          ...prev,
          assignments:prev.assignments.map((a)=>a.id===response.data.id?response.data:a)}))
        toast.success("Successfully updated assignment.");
        
      } else {
        let response=await axios.post("api/module/assignment/create", payload);
        setModule((prev) => ({
          ...prev,
          assignments: [...prev.assignments, response.data],
        }));
        toast.success("Assignment Created Successfully.");
      }
    } catch {
      toast.error("Failed to submit form.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={(state) => {setOpen?.(state ? "assignment" : null) ;}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Assignment</DialogTitle>
          <DialogDescription>Update assignment details below</DialogDescription>
        </DialogHeader>
        <AssignmentForm assignment={item} onSubmit={onSubmit} disabled={disabled}/>
        <DialogFooter>
          <Button onClick={() => setOpen?.(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AssignmentPobup);