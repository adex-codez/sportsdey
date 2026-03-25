import type { ComponentType, SVGProps } from "react";
import BellIcon from "@/logos/bell.svg?react";
import BettingIcon from "@/logos/betting.svg?react";
import LikeIcon from "@/logos/like.svg?react";
import LogoutIcon from "@/logos/log-out.svg?react";
import ProfileIcon from "@/logos/profile.svg?react";
import WalletIcon from "@/logos/wallet.svg?react";

export type WalletMenuItem = {
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	path?: string;
};

export const walletMenuItems: WalletMenuItem[] = [
	{ label: "Profile", icon: ProfileIcon, path: "/account" },
	{ label: "Notifications", icon: BellIcon },
	{ label: "Wallet & Credits", icon: WalletIcon, path: "/wallet" },
	{ label: "Verification", icon: BellIcon },
	{ label: "Betting", icon: BettingIcon },
	{ label: "Engage", icon: LikeIcon },
];

export const walletLogoutItem = {
	label: "Log Out",
	icon: LogoutIcon,
} as const satisfies WalletMenuItem;
