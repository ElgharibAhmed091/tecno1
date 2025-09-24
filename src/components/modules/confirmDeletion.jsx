import { Loader2, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";

export const DelationPopup= ({handelClick,isDeleting,name,isDeleteDialogOpen,setIsDeleteDialogOpen,disabled})=>{
    return(
    <Dialog open={isDeleteDialogOpen} onOpenChange={()=>setIsDeleteDialogOpen((prev)=>!prev)}>
    <DialogTrigger asChild>
      <Button
       size="sm"
       variant="ghost" 
       className="text-red-500 hover:bg-red-100"
       disabled={disabled}
       >
        <Trash size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this {name} ? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handelClick} disabled={isDeleting}>
          {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )}
export default DelationPopup