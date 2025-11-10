export type Health = {
  status: 'ok' | 'offline';
  uptimeMs: number | null;
  roomCount: number| null;
  fullRoomCount: number | null;
}
