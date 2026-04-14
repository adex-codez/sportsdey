import { type ReactNode, useState } from "react";
import type { Admin } from "../lib/auth";
import Header from "./Header";
import Sidebar from "./Sidebar";

type LayoutProps = {
	children: ReactNode;
	admin?: Admin | null;
	onLogout?: () => void;
};

export default function Layout({ children, admin, onLogout }: LayoutProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	return (
		<div className="flex min-h-screen bg-background">
			<Sidebar
				admin={admin}
				onLogout={onLogout}
				collapsed={sidebarCollapsed}
				onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
			/>
			<div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-black">
				<Header admin={admin} />
				<main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background rounded-tl-[40px]">
					{children}
				</main>
			</div>
		</div>
	);
}
