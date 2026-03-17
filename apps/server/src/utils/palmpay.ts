const PALMPAY_BASE_URL = "https://open-gw-daily.palmpay-inc.com";

function generateNonceStr(length = 16): string {
	const chars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export type SceneCode = "airtime" | "data" | "betting";

export interface PalmPayBiller {
	billerId: string;
	billerName: string;
	billerIcon: string;
	minAmount: number | null;
	maxAmount: number | null;
	status: number;
}

export interface PalmPayItem {
	billerId: string;
	itemId: string;
	itemName: string;
	amount: number | null;
	maxAmount: number | null;
	minAmount: number | null;
	isFixAmount: number;
	status: number;
	extInfo?: {
		validityDate?: number;
		itemSize?: string;
		itemDescription?: Record<string, string>;
	};
}

export interface PalmPayOrder {
	outOrderNo: string;
	orderNo: string;
	orderStatus: number;
	msg: string;
	amount: number;
	sceneCode: string;
}

interface PalmPayResponse<T> {
	respCode: string;
	respMsg: string;
	data: T;
	status: boolean;
}

async function palmPayRequest<T>(
	endpoint: string,
	apiKey: string,
	body: Record<string, unknown>,
): Promise<{ ok: boolean; data?: T; error?: string }> {
	const url = `${PALMPAY_BASE_URL}${endpoint}`;
	const nonceStr = generateNonceStr();

	const payload = {
		requestTime: Date.now(),
		nonceStr,
		version: "V2",
		...body,
	};

	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				CountryCode: "NG",
				"Content-Type": "application/json",
				Accept: "application/json, text/plain, */*",
			},
			body: JSON.stringify(payload),
		});

		const data = (await res.json()) as PalmPayResponse<T>;

		if (data.respCode === "00000000" && data.status) {
			return { ok: true, data: data.data };
		}

		return { ok: false, error: data.respMsg || "Request failed" };
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Unknown error",
		};
	}
}

export async function queryBillers(
	apiKey: string,
	sceneCode: SceneCode,
): Promise<{ ok: boolean; data?: PalmPayBiller[]; error?: string }> {
	return palmPayRequest<PalmPayBiller[]>(
		"/api/v2/bill-payment/biller/query",
		apiKey,
		{ sceneCode },
	);
}

export async function queryItems(
	apiKey: string,
	sceneCode: SceneCode,
	billerId: string,
): Promise<{ ok: boolean; data?: PalmPayItem[]; error?: string }> {
	return palmPayRequest<PalmPayItem[]>(
		"/api/v2/bill-payment/item/query",
		apiKey,
		{ sceneCode, billerId },
	);
}

export interface CreateOrderParams {
	apiKey: string;
	sceneCode: SceneCode;
	outOrderNo: string;
	amount: number;
	billerId: string;
	itemId: string;
	rechargeAccount: string;
	notifyUrl?: string;
	title?: string;
	description?: string;
	relationId?: string;
}

export async function createOrder(
	params: CreateOrderParams,
): Promise<{ ok: boolean; data?: PalmPayOrder; error?: string }> {
	const { apiKey, amount, ...rest } = params;

	return palmPayRequest<PalmPayOrder>(
		"/api/v2/bill-payment/order/create",
		apiKey,
		{
			...rest,
			amount: amount * 100,
		},
	);
}
