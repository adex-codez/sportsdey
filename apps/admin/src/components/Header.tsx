import { Bell, ChevronDown, Search } from "lucide-react";
import type { Admin } from "../lib/auth";

type HeaderProps = {
	admin?: Admin | null;
};

export default function Header({ admin: _admin }: HeaderProps) {
	return (
		<header className="flex h-16 shrink-0 items-center gap-6 bg-black px-6 text-white">
			<div className="flex flex-1 justify-center">
				<div className="relative flex h-10 w-full max-w-[480px] items-center rounded-full border border-white/10 bg-white px-4">
					<input
						type="text"
						placeholder="Search all files..."
						className="flex-1 border-none bg-transparent p-0 text-primary/80 text-sm outline-none"
					/>
					<Search size={18} className="ml-2 shrink-0 text-primary/80" />
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-4">
				<button
					type="button"
					className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/05 text-white transition-colors duration-180 hover:bg-white/12"
				>
					<Bell size={20} />
				</button>

				<div className="flex cursor-pointer items-center gap-1.5">
					<img
						src="https://i.pravatar.cc/40"
						alt="Admin avatar"
						className="h-9 w-9 rounded-full object-cover"
					/>
					<ChevronDown size={14} className="text-white/60" />
				</div>
			</div>
		</header>
	);
}
