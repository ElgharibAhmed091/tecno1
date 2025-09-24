import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { memo } from "react";
import LessonForm from "./lessonForm";

const LessonPopup = ({ open, setOpen, lesson, order,module_id,disabled }) => {
  return (
    <Dialog open={open} onOpenChange={(state) => setOpen?.(state ? "lesson" : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit" : "Create"} Lesson</DialogTitle>
          <DialogDescription>Update lesson details below</DialogDescription>
        </DialogHeader>
        <LessonForm lesson={lesson} order={order+1} module_id={module_id?.id} disabled={disabled}/>
        <DialogFooter>
          <Button onClick={() => setOpen?.(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(LessonPopup);
