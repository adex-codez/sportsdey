import { useNavigate } from "@tanstack/react-router";
import { walletLogoutItem, walletMenuItems } from "./wallet-menu-items";

export function WalletSidebar() {
	const navigate = useNavigate();
	const WalletLogoutIcon = walletLogoutItem.icon;

	const handleNavigate = (path?: string) => {
		if (!path) return;
		navigate({ to: path });
	};

	return (
		<aside className="h-fit self-start rounded-2xl bg-white p-4 shadow-sm dark:bg-[#202120]">
			<nav aria-label="Wallet menu" className="mt-4">
				<ul className="space-y-2">
					{walletMenuItems.map(({ label, icon: Icon, path: itemPath }) => (
						<li key={label}>
							<button
								type="button"
								onClick={() => handleNavigate(itemPath)}
								className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-primary hover:bg-[#EEF0ED] dark:text-white dark:hover:bg-[#2A2A2A]"
							>
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0ED] dark:bg-[#2A2A2A]">
									<Icon width={18} height={18} className="block" />
								</span>
								<span className="font-medium text-sm">{label}</span>
							</button>
						</li>
					))}
					<li>
						<button
							type="button"
							className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[#FD4585] hover:bg-[#FDF2F8]"
						>
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8E9FE]">
								<WalletLogoutIcon width={18} height={18} className="block" />
							</span>
							<span className="font-medium text-sm">
								{walletLogoutItem.label}
							</span>
						</button>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
