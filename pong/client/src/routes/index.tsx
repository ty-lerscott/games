import prettyMs from 'pretty-ms';
import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'

import { getHealth } from '@/lib/api.ts';
import Badge from '@/components/Badge.tsx';
import type { Health } from '../../../types/health.ts';
import getFormattedDateTime from '@/lib/date-time-format.ts';

// @ts-ignore: pathname route is being weird
export const Route = createFileRoute('/')({
  component: Health,
})

function Health() {
	const [currentTime, setCurrentTime] = useState(getFormattedDateTime())
	const [health, setHealth] = useState<Health>({
		status: 'offline',
		uptimeMs: null,
		roomCount: 0,
		fullRoomCount: 0
	});

	const prettyTime = health.uptimeMs && Number.isFinite(health.uptimeMs) ? prettyMs(health.uptimeMs, {
		verbose: false,
		compact: false,
		secondsDecimalDigits: 0
	}) : 'N/A';

	useEffect(() => {
		// deno-lint-ignore prefer-const
		let timer: number;

		const pollHealth = async () => {
			try {
				const response = await getHealth();

				setHealth(response);
				setCurrentTime(getFormattedDateTime());
			} catch {
				setHealth({
					status: 'offline',
					uptimeMs: null,
					roomCount: null,
					fullRoomCount: null
				});
			}
		}

		pollHealth();

		timer = setInterval(pollHealth, 5000);

		return () => {
			clearInterval(timer);
		}
	}, [])

	return (
		<div className="flex justify-center items-center h-full">
			<div className="border p-8 rounded-[1rem] bg-card flex flex-col w-full max-w-[20rem]">
				<h1 className="text-2xl font-bold">Server Health</h1>
				<span className="text-subtle">As of {currentTime}</span>

				<Badge status={health.status} />

				<div className="flex justify-between">
					<span className="text-subtle">Uptime</span>
					<span>{prettyTime}</span>
				</div>

				{!Number.isNaN(health.roomCount) ? (
					<div className="flex justify-between">
						<span className="text-subtle">Total Rooms</span>
						<span>{health.roomCount}</span>
					</div>
				) : null}

				{!Number.isNaN(health.fullRoomCount) ? (
					<div className="flex justify-between">
						<span className="text-subtle">Rooms w/ Two Players</span>
						<span>{health.fullRoomCount}</span>
					</div>
				) : null}
			</div>
		</div>
	)
}
