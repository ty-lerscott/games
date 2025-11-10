import json from '@/helpers/to-json.ts';
import { getRooms, createRoom } from '@/state/room.ts';

const roomsHandler = (req: Request): Response => {
    switch (req.method) {
        case 'GET': {
            return json(getRooms())
        }
        case 'POST': {
            console.log(req.body);
            // const room = createRoom
            return json({});
        }
        default: {
            return new Response('Not Found', {status: 404})
        }
    }
}

export default roomsHandler;