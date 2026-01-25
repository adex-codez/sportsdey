/**
 * Safely parses a date string, handling both ISO and DD/MM/YYYY formats
 */
export function safeParseDate(dateStr: string | Date): Date {
	if (dateStr instanceof Date) return dateStr;

	// Check if it's in DD/MM/YYYY format (e.g. 05/01/2026 15:00)
	const dmyRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(.*)/;
	const match = dateStr.match(dmyRegex);

	if (match) {
		const day = Number.parseInt(match[1]);
		const month = Number.parseInt(match[2]) - 1; // 0-indexed
		const year = Number.parseInt(match[3]);
		const rest = match[4].trim();

		if (rest) {
			const timeParts = rest.split(":");
			const hour = Number.parseInt(timeParts[0]) || 0;
			const minute = Number.parseInt(timeParts[1]) || 0;
			const second = Number.parseInt(timeParts[2]) || 0;
			return new Date(year, month, day, hour, minute, second);
		}
		return new Date(year, month, day);
	}

	// Fallback to standard parsing (for ISO strings etc)
	return new Date(dateStr);
}

/**
 * Calculates the time difference between a future date and now
 * Returns formatted string like "2hrs: 30m" or "30m 20s"
 */
export function getTimeUntilStart(scheduledTime: string | Date): string {
	const now = new Date();
	const startTime = safeParseDate(scheduledTime);

	const diffMs = startTime.getTime() - now.getTime();

	// If the time has passed, return empty string
	if (diffMs <= 0) {
		return "";
	}

	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	const remainingMinutes = diffMinutes % 60;

	// If it's more than 48 hours, then show days
	if (diffDays >= 2) {
		const remainingHours = diffHours % 24;
		return `${diffDays}d : ${remainingHours}h`;
	}

	// For anything less than 2 days, show in hours and minutes
	if (diffHours > 0) {
		return `${diffHours}hrs : ${remainingMinutes}mins`;
	}
	const remainingSeconds = diffSeconds % 60;
	return `${diffMinutes}mins : ${remainingSeconds}secs`;
}
