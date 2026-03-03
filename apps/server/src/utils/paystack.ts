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
				amount: amount * 100,
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

export interface TransferRecipient {
	id: string;
	reference: string;
}

export async function createTransferRecipient(
	secretKey: string,
	type: "bank" | "mobile_money",
	bankCode: string,
	accountNumber: string,
	name: string,
	currency = "NGN",
): Promise<TransferRecipient> {
	const response = await fetch("https://api.paystack.co/transferrecipient", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			type,
			bank_code: bankCode,
			account_number: accountNumber,
			name,
			currency,
		}),
	});

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: { id: string; reference: string };
	};

	if (!response.ok) {
		throw new Error(data.message || "Failed to create transfer recipient");
	}

	return {
		id: data.data.id,
		reference: data.data.reference,
	};
}

export async function initiateTransfer(
	secretKey: string,
	amount: number,
	recipientCode: string,
	source = "balance",
	reason = "Withdrawal",
): Promise<{ reference: string; status: string }> {
	const response = await fetch("https://api.paystack.co/transfer", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount: amount * 100,
			recipient: recipientCode,
			source,
			reason,
		}),
	});

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: { reference: string; status: string };
	};

	if (!response.ok) {
		throw new Error(data.message || "Failed to initiate transfer");
	}

	return {
		reference: data.data.reference,
		status: data.data.status,
	};
}

export interface AccountVerification {
	isValid: boolean;
	accountName: string;
	accountNumber: string;
	bankId: number;
}

export async function verifyAccountNumber(
	secretKey: string,
	accountNumber: string,
	bankCode: string,
): Promise<AccountVerification> {
	const response = await fetch(
		`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
		{
			headers: {
				Authorization: `Bearer ${secretKey}`,
			},
		},
	);

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: {
			account_number: string;
			account_name: string;
			bank_id: number;
		};
	};

	if (!response.ok || !data.status) {
		return {
			isValid: false,
			accountName: "",
			accountNumber: "",
			bankId: 0,
		};
	}

	return {
		isValid: true,
		accountName: data.data.account_name,
		accountNumber: data.data.account_number,
		bankId: data.data.bank_id,
	};
}
