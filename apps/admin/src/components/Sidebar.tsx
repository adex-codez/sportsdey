import { Link, useRouterState } from "@tanstack/react-router";
import {
	Activity,
	ChevronLeft,
	ChevronRight,
	FileText,
	Gamepad2,
	Home,
	LogOut,
	type LucideIcon,
	Settings,
	Ticket,
	Users,
	Wallet,
} from "lucide-react";
import type { Admin } from "../lib/auth";

type SidebarProps = {
	admin?: Admin | null;
	onLogout?: () => void;
	collapsed: boolean;
	onToggleCollapse: () => void;
};

type NavItem = {
	label: string;
	icon?: LucideIcon;
	to?: string;
};

const menuItems: NavItem[] = [
	{ icon: Home, label: "Dashboard", to: "/" },
	{ icon: Users, label: "User management", to: "/users" },
	{ icon: Wallet, label: "Wallet & Payments" },
	{ icon: Gamepad2, label: "Game management" },
	{ icon: Ticket, label: "Ticket history" },
	{ icon: Settings, label: "CMS Controls" },
	{ icon: Activity, label: "Activity log" },
];

const otherItems: NavItem[] = [
	{ icon: FileText, label: "KYC & Document Uploads" },
	{ icon: Settings, label: "General setting" },
];

export default function Sidebar({
	admin,
	onLogout,
	collapsed,
	onToggleCollapse,
}: SidebarProps) {
	const { location } = useRouterState();

	return (
		<aside
			className={`relative z-20 flex min-h-screen w-60 shrink-0 flex-col bg-black text-white transition-all duration-250 ${collapsed ? "w-[72px]" : ""}`}
		>
			<div
				className={`flex items-center justify-between px-5 py-5 ${collapsed ? "justify-center" : ""}`}
			>
				{!collapsed && (
					<img
						src="/sportsdey-logo.png"
						alt="SportsDey"
						className="h-8 w-auto object-contain"
					/>
				)}
				<button
					type="button"
					className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/06 text-white/60 transition-all duration-180 hover:bg-white/12 hover:text-white"
				>
					<Settings size={18} />
				</button>
			</div>

			<button
				type="button"
				className="absolute top-[55px] -right-6 z-25 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-accent text-white transition-all duration-180 hover:bg-accent/90"
				onClick={onToggleCollapse}
				title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
			</button>

			<div className="flex-1 overflow-y-auto pb-3">
				<div
					className={`flex items-center justify-between px-5 py-2 ${collapsed ? "justify-center" : ""}`}
				>
					{!collapsed && (
						<span className="font-semibold text-accent text-xs uppercase tracking-wider">
							Menu
						</span>
					)}
				</div>

				<nav
					className={`flex flex-col gap-0.5 px-3 ${collapsed ? "px-2" : ""}`}
				>
					{menuItems.map((item) => {
						const isActive = item.to
							? item.to === "/"
								? location.pathname === "/"
								: location.pathname.startsWith(item.to)
							: false;

						return (
							<SidebarItem
								key={item.label}
								icon={item.icon}
								label={item.label}
								to={item.to}
								active={isActive}
								collapsed={collapsed}
							/>
						);
					})}
				</nav>

				<div
					className={`mt-6 flex items-center justify-between px-5 py-2 ${collapsed ? "justify-center" : ""}`}
				>
					{!collapsed && (
						<span className="font-semibold text-green-500 text-xs uppercase tracking-wider">
							Others
						</span>
					)}
				</div>

				<nav
					className={`flex flex-col gap-0.5 px-3 ${collapsed ? "px-2" : ""}`}
				>
					{otherItems.map((item) => (
						<SidebarItem
							key={item.label}
							icon={item.icon}
							label={item.label}
							collapsed={collapsed}
						/>
					))}
				</nav>
			</div>

			<div className="mt-auto border-white/08 border-t px-4 py-4">
				<button
					type="button"
					onClick={onLogout}
					className={`flex w-full cursor-pointer items-center gap-2.5 border-none bg-none py-2 text-sm text-white/50 transition-colors duration-180 hover:text-white ${collapsed ? "justify-center" : ""}`}
				>
					<LogOut size={18} />
					{!collapsed && <span>Log out</span>}
				</button>

				<div
					className={`mt-4 flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}
				>
					<img
						src="https://i.pravatar.cc/40"
						alt="Admin avatar"
						className="h-10 w-10 shrink-0 rounded-full object-cover"
					/>
					{!collapsed && (
						<div className="min-w-0 flex-1">
							<p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[13px] text-white">
								{admin?.name || "Olivia Rhye"}
							</p>
							<p className="m-0 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-white/45">
								{admin?.email || "olivia@untitledui.com"}
							</p>
						</div>
					)}
					{!collapsed && (
						<button
							type="button"
							className="flex shrink-0 cursor-pointer items-center justify-center border-none bg-none p-1 text-white/40 transition-colors duration-180 hover:text-white"
						>
							<LogOut size={16} />
						</button>
					)}
				</div>
			</div>
		</aside>
	);
}

function SidebarItem({
	icon: Icon,
	label,
	active = false,
	to,
	collapsed = false,
}: {
	icon?: LucideIcon;
	label: string;
	active?: boolean;
	to?: string;
	collapsed?: boolean;
}) {
	const className = `flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-medium text-white no-underline cursor-pointer transition-all duration-180 hover:bg-white/07 hover:text-white/85 ${active ? "bg-accent text-white hover:bg-green-600" : ""}`;

	if (to) {
		return (
			<Link to={to} className={className} title={collapsed ? label : undefined}>
				{Icon ? <Icon size={18} /> : null}
				{!collapsed && <span>{label}</span>}
			</Link>
		);
	}

	return (
		<div className={className} title={collapsed ? label : undefined}>
			{Icon ? <Icon size={18} /> : null}
			{!collapsed && <span>{label}</span>}
		</div>
	);
}
