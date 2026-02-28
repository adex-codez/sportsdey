export interface PaystackTransaction {
	reference: string;
	amount: number;
	currency: string;
	status: string;
	metadata: Record<string, unknown>;
	customer: {
		email: string;
	};
}

export interface InitializeTransactionResponse {
	reference: string;
	authorizationUrl: string;
}

export async function initializeTransaction(
	secretKey: string,
	amount: number,
	email: string,
	metadata?: Record<string, unknown>,
): Promise<InitializeTransactionResponse> {
	const response = await fetch(
		"https://api.paystack.co/transaction/initialize",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${secretKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				amount,
				email,
				currency: "NGN",
				metadata,
			}),
		},
	);

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: { reference: string; authorization_url: string };
	};

	if (!response.ok) {
		throw new Error(data.message || "Failed to initialize transaction");
	}

	return {
		reference: data.data.reference,
		authorizationUrl: data.data.authorization_url,
	};
}

export async function verifyTransaction(
	secretKey: string,
	reference: string,
): Promise<PaystackTransaction> {
	const response = await fetch(
		`https://api.paystack.co/transaction/verify/${reference}`,
		{
			headers: {
				Authorization: `Bearer ${secretKey}`,
			},
		},
	);

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: PaystackTransaction;
	};

	if (!response.ok) {
		throw new Error(data.message || "Failed to verify transaction");
	}

	return data.data;
}

export async function verifyWebhookSignature(
	secretKey: string,
	payload: string,
	signature: string,
): Promise<boolean> {
	const crypto = await import("crypto");
	const hash = crypto
		.createHmac("sha512", secretKey)
		.update(payload)
		.digest("hex");
	return hash === signature;
}
