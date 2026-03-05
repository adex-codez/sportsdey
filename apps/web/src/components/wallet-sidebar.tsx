import type { ComponentType, SVGProps } from "react";
import BellIcon from "@/logos/bell.svg?react";
import BettingIcon from "@/logos/betting.svg?react";
import LikeIcon from "@/logos/like.svg?react";
import LogoutIcon from "@/logos/log-out.svg?react";
import ProfileIcon from "@/logos/profile.svg?react";
import WalletIcon from "@/logos/wallet.svg?react";

const walletMenuItems = [
	{ label: "Profile", icon: ProfileIcon },
	{ label: "Notifications", icon: BellIcon },
	{ label: "Wallet & Credits", icon: WalletIcon },
	{ label: "Verification", icon: BellIcon },
	{ label: "Betting", icon: BettingIcon },
	{ label: "Engage", icon: LikeIcon },
] as const satisfies ReadonlyArray<{
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
}>;

export function WalletSidebar() {
	return (
		<aside className="h-fit self-start rounded-2xl bg-white p-4 shadow-sm dark:bg-[#202120]">
			<nav aria-label="Wallet menu">
				<ul className="space-y-2">
					{walletMenuItems.map(({ label, icon: Icon }) => (
						<li key={label}>
							<button
								type="button"
								className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-primary dark:text-white"
							>
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0ED]">
									<Icon width={18} height={18} className="block" />
								</span>
								<span className="font-medium text-sm">{label}</span>
							</button>
						</li>
					))}
					<li>
						<button
							type="button"
							className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[#FD4585]"
						>
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8E9FE]">
								<LogoutIcon width={18} height={18} className="block" />
							</span>
							<span className="font-medium text-sm">Log Out</span>
						</button>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
