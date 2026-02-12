export const DEFAULT_TIMEOUT = 8000;

export async function fetchWithTimeout(
	url: string,
	options: RequestInit = {},
	timeout: number = DEFAULT_TIMEOUT,
): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === "AbortError") {
			throw new FetchTimeoutError(
				`Request to ${url} timed out after ${timeout}ms`,
			);
		}
		throw error;
	}
}

export class FetchTimeoutError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "FetchTimeoutError";
	}
}

export function isTimeoutError(error: unknown): error is FetchTimeoutError {
	return (
		error instanceof FetchTimeoutError ||
		(error instanceof Error && error.name === "AbortError")
	);
}
