import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router'

import { getRooms } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { RoomSummary } from '~/types/room';
import CreateRoom from '@/components/CreateRoom';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group"

// @ts-ignore: pathname route is being weird
export const Route = createFileRoute('/rooms')({
	component: RoomsComponent,
})

function RoomsComponent() {
	const [rooms, setRooms] = useState<RoomSummary[]>([]);

	useEffect(() => {
			// deno-lint-ignore prefer-const
			let timer: number;
	
			const pollRooms = async () => {
				try {
					const response = await getRooms();
	
					setRooms(response);
				} catch {
					setRooms([]);
				}
			}
	
			pollRooms();
	
			timer = setInterval(pollRooms, 5000);
	
			return () => {
				clearInterval(timer);
			}
		}, [])
	
	return (
		<div className="p-4 max-w-[50vw] mx-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Rooms</h1>
				<CreateRoom />
			</div>

			<div className="mt-4">
				<InputGroup>
					<InputGroupInput placeholder="Search available rooms..." />
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
				</InputGroup>
			</div>

			{rooms.length > 0 ? rooms.map(room => {
				return (
					<div key={room.id} className="border p-4 rounded-lg mt-4 flex justify-between items-center">
						<div>
							<h2 className="text-lg font-semibold">{room.name}</h2>
							<p className="text-subtle">Players: {room.players}/2</p>
						</div>
						<Button>Join</Button>
					</div>
				)
			}) : (
				<div className="mt-8 text-center text-subtle">
					No rooms available.
				</div>
			)}
		</div>
	)
}
