export const SPORTS = {
	FOOTBALL: "football",
	TENNIS: "tennis",
	BASKETBALL: "basketball",
} as const;

export type Sport = (typeof SPORTS)[keyof typeof SPORTS];
