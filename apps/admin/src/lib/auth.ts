const API_BASE = (() => {
	// Prefer explicit env override for dev/stage/prod
	const envBase = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
	if (envBase) return envBase;

	// Fallback to hostname-based inference
	if (typeof window !== "undefined" && window.location) {
		const hostname = window.location.hostname;
		if (hostname === "localhost" || hostname === "127.0.0.1") {
			return "http://localhost:3000";
		}
		if (hostname.includes("staging")) {
			return "https://staging-api.sportsdey.com";
		}
		return "https://api.sportsdey.com";
	}
	return "https://api.sportsdey.com";
})();

export interface Admin {
	id: string;
	email: string;
	name: string;
	role: "super_admin" | "admin";
	createdAt: string;
}

export interface SignInResponse {
	success: boolean;
	data?: {
		admin: Admin;
	};
	error?: string;
}

export interface AdminListResponse {
	success: boolean;
	data: Admin[];
}

class AdminAuth {
	private baseUrl: string;

	constructor(baseUrl: string = API_BASE) {
		this.baseUrl = baseUrl;
	}

	private logBase(reason: string) {
		if (import.meta.env?.MODE === "development") {
			console.debug(`[adminAuth] ${reason} baseUrl=${this.baseUrl}`);
		}
	}

	async signIn(email: string, password: string): Promise<SignInResponse> {
		this.logBase("signIn");
		const response = await fetch(`${this.baseUrl}/admin/auth/sign-in`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
			credentials: "include",
		});

		return response.json();
	}

	async signOut(): Promise<void> {
		await fetch(`${this.baseUrl}/admin/auth/sign-out`, {
			method: "POST",
			credentials: "include",
		});
	}

	async getSession(): Promise<Admin | null> {
		try {
			const response = await fetch(`${this.baseUrl}/admin/me`, {
				credentials: "include",
			});

			if (response.status === 401) {
				return null;
			}

			const data = await response.json();
			if (data.success) {
				return data.data;
			}
			return null;
		} catch {
			return null;
		}
	}

	async listAdmins(): Promise<Admin[]> {
		const response = await fetch(`${this.baseUrl}/admin/admins`, {
			credentials: "include",
		});

		const data = await response.json();
		if (data.success) {
			return data.data;
		}
		throw new Error(data.error || "Failed to fetch admins");
	}

	async createAdmin(data: {
		email: string;
		password: string;
		name: string;
		role: "super_admin" | "admin";
	}): Promise<Admin> {
		const response = await fetch(`${this.baseUrl}/admin/admins`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		});

		const result = await response.json();
		if (result.success) {
			return result.data;
		}
		throw new Error(result.error || "Failed to create admin");
	}

	async deleteAdmin(id: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/admin/admins/${id}`, {
			method: "DELETE",
			credentials: "include",
		});

		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || "Failed to delete admin");
		}
	}
}

export const adminAuth = new AdminAuth();
