import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_API_URL,
	basePath: "/auth",
	fetchOptions: {
		credentials: "include",
	},
});

export const { signIn, signOut, signUp, useSession, getSession, changeEmail } =
	authClient;
