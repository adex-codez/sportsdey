/**
 * Calculates the time difference between a future date and now
 * Returns formatted string like "2h 30m" or "30m 20s"
 */
export function getTimeUntilStart(scheduledTime: string | Date): string {
  const now = new Date();
  const startTime = new Date(scheduledTime);
  const diffMs = startTime.getTime() - now.getTime();

  // If the time has passed, return empty string
  if (diffMs <= 0) {
    return "Starting soon";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Format based on time remaining
  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    return `${diffDays}d ${remainingHours}h`;
  } else if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60;
    return `${diffHours}h ${remainingMinutes}m`;
  } else if (diffMinutes > 0) {
    const remainingSeconds = diffSeconds % 60;
    return `${diffMinutes}m ${remainingSeconds}s`;
  } else {
    return `${diffSeconds}s`;
  }
}
