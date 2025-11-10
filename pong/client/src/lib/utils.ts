import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { createId } from "@paralleldrive/cuid2"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getOrCreateUserId = (): string => {
	const key = 'pong-user';
	let userId = sessionStorage.getItem(key);

	if (!userId) {
		userId = createId();;
		sessionStorage.setItem(key, userId);
	}
	return userId;
}