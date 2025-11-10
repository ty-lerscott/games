import type { Room } from "~/types/room.ts";
import type { PlayerId } from "~/types/index.ts";

const broadcast = (room: Room, msg: unknown, except?: PlayerId): void => {
    const payload = JSON.stringify(msg);

    for (const [playerId, socket] of room.players) {
        if (playerId === except) {
            continue;
        }
        try {
            socket.send(payload);
        } catch {
            /* ignore */
        }
    }
}

export default broadcast;