const API_BASE_URL =
	process.env.VITE_SERVER_URL || "http://localhost:3000/api/";

type ApiSuccessResponse<T> = {
	data: T;
};

type ApiErrorResponse = {
  error: string
  details: [
    {
      field: string,
      message: string,
      code:
    }
  ]
}

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiSuccessResponse<T>> {
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
		const json = (await response.json()) as ApiSuccessResponse<T>;
		return json.data;
	} catch (error) {
		throw error;
	}
}
