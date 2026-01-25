import { useCallback } from "react";
import type { StringInputProps } from "sanity";

export function SportInput(props: StringInputProps) {
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const lowercasedValue = event.target.value.toLowerCase();
			props.onChange({
				// @ts-expect-error - Sanity types
				value: lowercasedValue,
			});
		},
		[props],
	);

	return (
		<input
			type="text"
			value={props.value || ""}
			onChange={handleChange}
			placeholder="Enter sport"
			style={{
				width: "100%",
				padding: "0.5rem",
				border: "1px solid #ccc",
				borderRadius: "4px",
				fontSize: "1rem",
			}}
		/>
	);
}
