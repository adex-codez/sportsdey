import { createAuthClient } from "better-auth/react";

const resolveAuthBaseUrl = () => {
	if (typeof window !== "undefined") {
		const hostname = window.location.hostname;
		if (hostname === "stagingweb.sportsdey.com") {
			return "https://staging-api.sportsdey.com";
		}
		if (hostname === "sportsdey.com" || hostname === "www.sportsdey.com") {
			return "https://api.sportsdey.com";
		}
	}
	return import.meta.env.VITE_API_URL || "http://localhost:8787";
};

export const authClient = createAuthClient({
	baseURL: resolveAuthBaseUrl(),
	basePath: "/auth",
	fetchOptions: {
		credentials: "include",
	},
});

export const { signIn, signOut, signUp, useSession, getSession, changeEmail } =
	authClient;
