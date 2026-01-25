import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button
				className="flex items-center justify-center"
				aria-label="Toggle theme"
			>
				<Sun width={24} height={24} color="#f4f4f4" />
			</button>
		);
	}

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle theme"
			className="flex items-center justify-center"
		>
			{theme === "dark" ? (
				<Sun width={24} height={24} color="#f4f4f4" />
			) : (
				<Moon width={24} height={24} color="#f4f4f4" />
			)}
		</button>
	);
}
