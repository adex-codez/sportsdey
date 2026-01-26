import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button
				className="flex items-center justify-center cursor-pointer"
				aria-label="Toggle theme"
			>
				<Moon width={24} height={24} color="#f4f4f4" />
			</button>
		);
	}

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle theme"
			className="group flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
		>
			<div className="relative h-6 w-6">
				<Moon
					width={24}
					height={24}
					className={cn(
						"absolute cursor-pointer inset-0 transition-all duration-500 ease-spring rotate-0 scale-100 dark:rotate-[360deg] dark:scale-0",
						theme === "dark" ? "opacity-0" : "opacity-100"
					)}
					color="#f4f4f4"
				/>
				<Sun
					width={24}
					height={24}
					className={cn(
						"absolute cursor-pointer inset-0 transition-all duration-500 ease-spring rotate-[-360deg] scale-0 dark:rotate-0 dark:scale-100",
						theme === "dark" ? "opacity-100" : "opacity-0"
					)}
					color="#f4f4f4"
				/>
			</div>
		</button>
	);
}

