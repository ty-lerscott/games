import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import { createRoom } from "@/lib/api"
import sanitizeInput from "@/utils/sanitize"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getOrCreateUserId } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"

const CreateRoom = () => {
    const navigate = useNavigate({ from : "/rooms" });
    const [roomName, setRoomName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    
    const handleCreateRoom = async () => {
        const sanitizedRoomName = sanitizeInput(roomName);
        
        if (sanitizedRoomName.length === 0) {
            setError("Room name cannot be empty.");
            setRoomName("");
            return;
        }

        const room = await createRoom(sanitizedRoomName);
        const userId = getOrCreateUserId();

        setRoomName("");
        navigate({ to: '/rooms/$roomId', params: { roomId: room.id }, search: { player1: userId } });
    }

    const handleRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) {
            setError(null);
        }
        setRoomName(e.target.value);
    }

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
                        <Input id="roomName" name="roomName" value={roomName} onChange={handleRoomName} />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCreateRoom}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateRoom;