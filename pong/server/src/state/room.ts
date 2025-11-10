import type { RoomId, Room, RoomSummary } from '~/types/room.ts';

export const rooms = new Map<RoomId, Room>();

export const createRoom = (name: Room['name']): Room => {
    const id = crypto.randomUUID();
    const room: Room = {
        id,
        name,
        players: new Map(),
        state: null,
    };

    rooms.set(id, room);

    return room;
}

export const getRoom = (id: RoomId): Room | null => rooms.get(id) ?? null
export const getSerializableRoom = (id: RoomId): RoomSummary | null => {
    const room = rooms.get(id);
     
    if (!room) return null;

    return {
        ...room,
        players: room.players.size
    };
}

export const getRoomCount = (): number => rooms.size;

export const getRooms = (): RoomSummary[] => Array.from(rooms.values()).map(room => ({
    ...room,
    players: room.players.size
}));

export const getFullRoomCount = (): number => {
    let count = 0;

    for (const room of rooms.values()) {
        if (room.players.size === 2) {
            count++;
        }
    }

    return count;
}

export const pruneEmptyRooms = (id: RoomId): void => {
    const room = rooms.get(id);

    if (room && room.players.size === 0) {
        rooms.delete(id);
    }
}