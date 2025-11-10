import type { Health } from "~/types/health.ts";
import type { RoomSummary } from "~/types/room.ts";

export const getHealth = async (): Promise<Health> => {
	try {
		const response = await fetch('/api/health');
		if (!response.ok) {
			throw new Error(`Error fetching health: ${response.statusText}`);
		}
		const data: Health = await response.json();
		return data;
	} catch (err) {
		return Promise.reject(err);
	}
}

export const getRooms = async (): Promise<RoomSummary[]> => {
	try {
		const response = await fetch('/api/rooms');
		if (!response.ok) {
			throw new Error(`Error fetching rooms: ${response.statusText}`);
		}
		const data: RoomSummary[] = await response.json();
		return data;
	} catch (err) {
		return Promise.reject(err);
	}
}

export const createRoom = async (roomName: string): Promise<RoomSummary> => {
	try {
		const response = await fetch('/api/rooms', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ roomName })
		});
		if (!response.ok) {
			throw new Error(`Error creating room: ${response.statusText}`);
		}
		const data: RoomSummary = await response.json();

		return data;
	} catch (err) {
		return Promise.reject(err);
	}
}