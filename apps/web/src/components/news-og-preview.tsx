import type { CSSProperties } from "react";

export const NewsOGPreview = ({
	title,
	body,
	image,
}: {
	title: string;
	body: string;
	image?: string;
}) => {
	return (
		<div
			style={{
				display: "flex",
				height: "100%",
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "white",
				fontFamily: '"Inter"',
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					width: "100%",
					height: "100%",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						display: "flex",
						width: "40%",
						height: "100%",
						position: "relative",
					}}
				>
					{image && (
						<img
							src={image}
							alt={title}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
							}}
						/>
					)}
				</div>

				{/* Content Side (Right, ~60%) */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: "60%",
						height: "100%",
						padding: "40px",
						justifyContent: "center",
						backgroundColor: "#ffffff",
					}}
				>
					<div
						style={{
							fontSize: 48,
							fontWeight: 700,
							color: "#111827",
							lineHeight: 1.1,
							marginBottom: "20px",
							// clamp text if possible, but satori handles overflow by hiding usually
						}}
					>
						{title}
					</div>
					<div
						style={{
							fontSize: 24,
							color: "#374151",
							lineHeight: 1.5,
							display: "flex",
						}}
					>
						{body ? body.slice(0, 150) + (body.length > 150 ? "..." : "") : ""}
					</div>

					<div
						style={{
							display: "flex",
							marginTop: "auto",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<div style={{ fontSize: 20, fontWeight: 600, color: "#000" }}>
							SportsDey
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
