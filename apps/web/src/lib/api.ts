const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3000/api";

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	};

	try {
		const response = await fetch(url, config);

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("API Request failed:", error);
		throw error;
	}
}
