export function generateUUIDv7(): string {
	const timestamp = Date.now();
	const timestampHex = Math.floor(timestamp).toString(16).padStart(12, "0");
	const randomHex = crypto.randomUUID().replace(/-/g, "").slice(10);
	return `${timestampHex}-${randomHex}`.slice(0, 36);
}
