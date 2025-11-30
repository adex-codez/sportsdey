export async function fetchWithErrorHandling(url: string, apiKey: string) {
	const res = await fetch(url, {
		headers: { "x-api-key": apiKey, Accept: "application/json" },
	});
	if (res.ok) {
		return { ok: true, data: await res.json() };
	}
	if (res.status === 400) {
		return {
			ok: false,
			error: {
				field: "sportradar_api",
				message: "Bad request (400)",
				code: "external_api_error",
				status: res.status,
			},
		};
	}
	if (res.status === 500) {
		return {
			ok: false,
			error: {
				field: "sportradar_api",
				message: "SportRadar Server Error (500)",
				code: "external_api_error",
				status: res.status,
			},
		};
	}
	return {
		ok: false,
		error: {
			field: "sportradar_api",
			message: `SportRadar API returned status ${res.status}`,
			code: "external_api_error",
			status: res.status,
		},
	};
}
