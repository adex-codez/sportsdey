const API_BASE_URL =
	import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api/";

type ApiSuccessResponse<T> = {
	data: T;
};

type ApiErrorResponse = {
	error: string;
	details: [
		{
			field: string;
			message: string;
			code: string;
		},
	];
};

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

	const response = await fetch(url, config);

	if (!response.ok) {
		const data = (await response.json()) as ApiErrorResponse;
		throw {
			status: response.status,
			...data,
		};
	}
	const json = (await response.json()) as ApiSuccessResponse<T>;
	return json.data;
}
