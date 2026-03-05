import { LogOut } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export function UserMenu() {
	const { data: session, isPending: isLoading } = useSession();
	const [isOpen, setIsOpen] = useState(false);

	const handleSignOut = async () => {
		await signOut();
		setIsOpen(false);
	};

	if (isLoading) {
		return (
			<button
				className="flex items-center justify-center p-2"
				aria-label="Loading"
			>
				<div className="h-6 w-6 animate-pulse rounded-full bg-white/20" />
			</button>
		);
	}

	if (session?.user) {
		const user = session.user;
		const displayName = user.name || "User";
		const initials = displayName
			.split(" ")
			.map((n: string) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
		const email = user.email || "";

		return (
			<div className="relative">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={cn(
						"flex items-center gap-2.5 rounded-full p-2.5 transition-colors",
						"hover:bg-white/10",
					)}
					aria-label="User menu"
					aria-expanded={isOpen}
				>
					{user.image ? (
						<img
							src={user.image}
							alt={displayName}
							className="h-8 w-8 rounded-full bg-[#F7C9B6] object-cover"
						/>
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7C9B6] font-medium text-[#5D2E1F] text-sm">
							{initials}
						</div>
					)}
					<svg
						viewBox="0 0 20 20"
						aria-hidden="true"
						className={cn(
							"h-5 w-5 fill-current text-secondary transition-transform",
							isOpen ? "rotate-180" : "rotate-0",
						)}
					>
						<polygon points="10,13.5 4.5,7.5 15.5,7.5" />
					</svg>
				</button>

				{isOpen && (
					<>
						<div
							className="fixed inset-0 z-40"
							onClick={() => setIsOpen(false)}
						/>
						<div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg bg-primary p-3 shadow-lg dark:bg-black">
							<div className="border-border border-b pb-3">
								<p className="truncate font-medium text-foreground">
									{displayName}
								</p>
								<p className="truncate text-muted-foreground text-sm">
									{email}
								</p>
							</div>
							<button
								onClick={handleSignOut}
								className="mt-3 flex w-full items-center gap-2 rounded-md px-2 py-2 text-destructive text-sm transition-colors hover:bg-destructive/10"
							>
								<LogOut className="h-4 w-4" />
								Sign out
							</button>
						</div>
					</>
				)}
			</div>
		);
	}

	return (
		<a
			href="/auth/sign-in"
			className="flex items-center justify-center rounded-full bg-[#F4F4F4] px-4 py-2 font-medium text-black text-sm transition-colors hover:bg-[#E5E5E5]"
		>
			<span className="flex items-center gap-2">Sign In</span>
		</a>
	);
}
