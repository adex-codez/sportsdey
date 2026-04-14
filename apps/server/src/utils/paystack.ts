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
	callbackUrl?: string,
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
				callback_url: callbackUrl,
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
	recipient_code: string;
}

export async function createTransferRecipient(
	secretKey: string,
	bankCode: string,
	accountNumber: string,
	name: string,
	currency = "NGN",
): Promise<TransferRecipient> {
	const body = {
		type: "nuban",
		bank_code: bankCode,
		account_number: accountNumber,
		name,
		currency,
	};
	console.log("Paystack create recipient:", body);

	const response = await fetch("https://api.paystack.co/transferrecipient", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	const data = await response.json();
	console.log("Paystack create recipient response:", data);

	const responseData = data as {
		status: boolean;
		message?: string;
		data?: { id: string; reference: string; recipient_code: string };
	};

	if (!response.ok || !responseData.status) {
		console.log("response message", responseData.message);
		throw new Error(responseData.message);
	}

	return {
		id: responseData.data!.id,
		reference: responseData.data!.reference,
		recipient_code: responseData.data!.recipient_code,
	};
}

export async function initiateTransfer(
	secretKey: string,
	amount: number,
	recipientCode: string,
	source = "balance",
	reason = "Withdrawal",
): Promise<{ reference: string; status: string }> {
	const body = {
		amount: amount * 100,
		recipient: recipientCode,
		source,
		reason,
	};
	console.log("Paystack initiate transfer:", body);

	const response = await fetch("https://api.paystack.co/transfer", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: { reference: string; status: string };
	};

	console.log("Paystack initiate transfer response:", data);

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

export interface NigerianBank {
	name: string;
	code: string;
	id: number;
}

export async function verifyAccountNumber(
	secretKey: string,
	accountNumber: string,
	bankCode: string,
): Promise<AccountVerification> {
	const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
	console.log("Paystack verify account:", { url, accountNumber, bankCode });

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${secretKey}`,
		},
	});

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: {
			account_number: string;
			account_name: string;
			bank_id: number;
		};
	};

	console.log("Paystack verify response:", data);

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

export async function getNigerianBanks(
	secretKey: string,
): Promise<NigerianBank[]> {
	const response = await fetch(
		"https://api.paystack.co/bank?country=nigeria&use_cursor=false&perPage=500",
		{
			headers: {
				Authorization: `Bearer ${secretKey}`,
			},
		},
	);

	const data = (await response.json()) as {
		status: boolean;
		message: string;
		data: Array<{ name: string; code: string; id: number }>;
	};

	if (!response.ok || !data.status) {
		throw new Error(data.message || "Failed to fetch banks");
	}

	return data.data.map((bank) => ({
		name: bank.name,
		code: bank.code,
		id: bank.id,
	}));
}
