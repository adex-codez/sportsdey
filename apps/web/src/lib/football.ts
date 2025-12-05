export const extractTeamInfo = (
	qualifier: "home" | "away",
	info: "name" | "score",
	teamInfo: {
		id: string;
		name: string;
		qualifier: string;
		score: number;
	}[],
) => {
	const team = teamInfo.find((info) => info.qualifier === qualifier);
	if (!team) {
		return "";
	}

	const val = team[info];
	return val;
};
