import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { type Admin, adminAuth } from "../lib/auth";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
});

function SignInPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("[sign-in] submit", { email, passwordLength: password.length });
		setError("");
		setLoading(true);

		try {
			const result = await adminAuth.signIn(email, password);
			console.log("[sign-in] response", result);
			if (result.success && result.data) {
				navigate({ to: "/" });
			} else {
				setError(result.error || "Invalid credentials");
			}
		} catch (err) {
			console.error("[sign-in] error", err);
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-10 shadow-md">
				<div>
					<h1 className="font-bold text-2xl">Sign in to your account</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div className="rounded-md bg-red-50 p-3 text-red-600 text-sm">
							{error}
						</div>
					)}

					<div>
						<label
							htmlFor="email"
							className="block font-medium text-gray-700 text-sm"
						>
							Email
						</label>
						<input
							id="email"
							type="text"
							autoComplete="off"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
							placeholder="admin@sportsdey.com"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block font-medium text-gray-700 text-sm"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
							placeholder="Enter your password"
						/>
						<div className="mt-2 text-right">
							<a
								href="#"
								className="text-sm font-medium text-accent hover:underline"
								onClick={(e) => e.preventDefault()}
							>
								Forgot password?
							</a>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={cn(
							"w-full cursor-pointer rounded-md border border-transparent px-4 py-2 font-medium text-white shadow-sm",
							"bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
							"disabled:cursor-not-allowed disabled:opacity-50",
						)}
					>
						{loading ? "Signing in..." : "Log in"}
					</button>
				</form>
			</div>
		</div>
	);
}
