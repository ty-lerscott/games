import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createId } from '@paralleldrive/cuid2';

const CreateRoom = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Room</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Room</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="roomName">Room Name</Label>
                        <Input id="roomName" name="roomName" defaultValue={createId()} />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateRoom;