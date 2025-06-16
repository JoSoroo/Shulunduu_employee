import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function DeleteItems({ open, onClose, onConfirm }){
    return(
        <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Та устгахдаа итгэлтэй байна уу</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Үүнийг устгасанаар дахин харах боломжгүй 
            </DialogDescription>
            <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Болих</Button>
            <Button variant="destructive" onClick={onConfirm}>Устгах</Button>
            </div>
            
        </DialogContent>
        </Dialog>
    );
}