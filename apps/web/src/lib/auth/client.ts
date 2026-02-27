import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
	fetchOptions: {
		credentials: "include",
	},
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
