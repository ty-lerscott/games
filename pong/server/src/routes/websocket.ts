import json from '@/helpers/to-json.ts';
import broadcast from '@/helpers/broadcast.ts';
import type { ClientMessage } from '~/types/messages.ts';
import { getRoom, createRoom, pruneEmptyRooms } from '@/state/room.ts';

const websocketHandler = (req: Request): Response => {
    if (req.method !== "GET") {
        return new Response("Method Not Allowed", {status: 405});
    }

    const url = new URL(req.url);
    const roomId = url.searchParams.get('roomId') ?? "";
    const playerId = url.searchParams.get("playerId") ?? "";

    if (!roomId || !playerId) {
        return json({
            error: "Missing roomId or playerId",
        }, {
            status: 409
        })
    }

    let room = getRoom(roomId);

    if (!room) {
        room = createRoom(roomId);
    }
    
    if (room.players.size >= 2 && !room.players.has(playerId)) {
        return json({
            error: 'Room already has two players',
        }, {
            status: 409
        })
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
        const previous = room.players.get(playerId);

        if (previous && previous !== socket) {
            try {
                previous.close(1012, "replaced");
            } catch (err) {
                console.error("Error closing previous socket:", err);
            }
        }

        socket.send(JSON.stringify({
            type: 'server_welcome',
            roomId,
            you: playerId
        }))

        if (room.state) {
            socket.send(JSON.stringify({
                type: 'state_update',
                state: room.state
            }))
        }

        broadcast(room, {
            type: 'player_joined',
            playerId,
        }, playerId);
    }
    socket.onmessage = (event) => {
        let msg: ClientMessage;

        try {
            msg = JSON.parse(String(event.data));
        } catch (err) {
            socket.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format',
            }));
            return;
        }

        switch (msg.type) {
            case 'client_ping': {
                socket.send(JSON.stringify({type: 'pong'}));
                break;
            }
            case 'client_state': {
                room.state = {...msg.state, lastUpdated: Date.now()}
                broadcast(room, {type: 'state_update', state: room.state}, playerId)
                break;
            }
            case 'sync_request': {
                if (room.state) {
                    socket.send(JSON.stringify({
                        type: 'state_update',
                        state: room.state
                    }))
                }
                break;
            }
            default: {
                socket.send(JSON.stringify({
                    type: 'error',
                    message: 'unknown message type'
                }))
            }
        }
    }
    socket.onclose = () => {
        const removed = room.players.delete(playerId);

        if (removed) {
            broadcast(room, {
                type: 'player_left',
                playerId,
            }, playerId);
        }

        pruneEmptyRooms(roomId);
    }
    socket.onerror = () => {
        try {
            socket.close();
        } catch {
            /* ignore */
        }
    }

    return response;
}

export default websocketHandler;