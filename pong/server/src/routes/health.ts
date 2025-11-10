import json from '@/helpers/to-json.ts';

import { getFullRoomCount, getRoomCount } from "../state/room.ts";

const healthCheck = (req: Request, serverStart: number): Response => {
    switch (req.method) {
        case 'GET':
            return json({
                status: 'ok',
                uptimeMs: Date.now() - serverStart,
                fullRoomCount: getFullRoomCount(),
                roomCount: getRoomCount(),
            })
        default:
            return new Response('Not Found', {status: 404})
    }
}

export default healthCheck;