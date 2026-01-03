import type {
	CompetitionGroup,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";

export function transformProxySchedule(
	data: any[],
): TransformedResponse {
	// Use a Map to group schedules by competition
	const competitionMap = new Map<string, CompetitionGroup>();

	// Iterate through each schedule and group by competition
	data.forEach((matchData) => {
		const {
			tournament,
			homeTeam,
			awayTeam,
			status,
			times,
			date,
			id,
		} = matchData;

		const competitionId = tournament.id;

		// Create competition group if it doesn't exist
		if (!competitionMap.has(competitionId)) {
			competitionMap.set(competitionId, {
				competition: {
					id: tournament.id,
					name: tournament.name,
				},
				matches: [],
			});
		}

		// Create match object
		const match: TransformedMatch = {
			id: id,
			competitors: {
				home: {
					id: homeTeam.id,
					name: homeTeam.name,
					score: homeTeam.score?.current ?? 0,
				},
				away: {
					id: awayTeam.id,
					name: awayTeam.name,
					score: awayTeam.score?.current ?? 0,
				},
			},
			start_time: date,
			match_status: status.shortName === "FT" ? "closed" : status.shortName, // Mapping FT to closed to match previous behavior if needed, or just keep it
			clock: times?.currentMinute
				? {
						played: times.currentMinute.toString(),
					}
				: undefined,
		};
		competitionMap.get(competitionId)!.matches.push(match);
	});

	// Convert Map to array
	const competitions = Array.from(competitionMap.values());

	// Calculate total matches count
	const total_matches = data.length;

	return { competitions, total_matches };
}

export function transformFootballMatchInfo(
	data: any,
	standings: import("@/types/football").TeamStanding[],
	top_scorers?: import("@/types/football").TopScorer[],
): TransformedMatchInfo {
	const event = data.sport_event;
	const status = data.sport_event_status;

	const competitors = event.competitors.map((c: any) => ({
		id: c.id,
		name: c.name,
		qualifier: c.qualifier,
		score: c.qualifier === "home" ? status.home_score : status.away_score,
	}));

	const transformed: TransformedMatchInfo = {
		competition: {
			id: event.sport_event_context.competition.id,
			name: event.sport_event_context.competition.name,
			gender: event.sport_event_context.competition.gender,
		},
		season: {
			id: event.sport_event_context.season.id,
		},
		competitors,
		match_info: {
			date_time: event.start_time,
			stadium: event.venue?.name ?? "",
			capacity: event.venue?.capacity ?? 0,
		},
		status: status.status === "closed" ? "finished" : status.status,
	};

	// Add clock only if status is not "ended" and clock exists
	if (status.match_status !== "ended" && data.clock) {
		transformed.clock = {
			played: data.clock.played,
			stoppage_time_played: data.clock.stoppage_time_played ?? "",
		};
	}

	if (standings) {
		transformed.standings = standings;
	}
	if (top_scorers) {
		transformed.top_scorers = top_scorers;
	}

	return transformed;
}

/**
 * Extracts the top 3 leaders of type 'points' from the leaders API response.
 * Each leader includes id, name, team info, gs (goals), and assists.
 */
export function transformTopScorers(
	leadersData: any,
): import("@/types/football").TopScorer[] {
	const pointsList = leadersData.lists?.filter(
		(list: any) => list.type === "points",
	);
	if (!pointsList.leaders) return [];

	return pointsList.leaders.slice(0, 3).map((leader: any) => {
		const player = leader.players[0];
		const team = player.competitors[0];
		const goals =
			team.datapoints.find((dp: any) => dp.type === "goals")?.value ?? 0;
		const assists =
			team.datapoints.find((dp: any) => dp.type === "assists")?.value ?? 0;

		return {
			id: player.id,
			name: player.name,
			team: {
				id: team.id,
				name: team.name,
				abbreviation: team.abbreviation,
			},
			gs: goals,
			assists,
		};
	});
}

export function getLast5Matches(summaryData: any, teamId: string) {
	return (summaryData.summaries ?? []).slice(0, 5).map((match: any) => {
		const home = match.sport_event.competitors.find(
			(c: any) => c.qualifier === "home",
		);
		const away = match.sport_event.competitors.find(
			(c: any) => c.qualifier === "away",
		);
		const homeScore = match.sport_event_status.home_score;
		const awayScore = match.sport_event_status.away_score;
		let result: "win" | "draw" | "loss";
		if (home.id === teamId) {
			if (homeScore > awayScore) result = "win";
			else if (homeScore < awayScore) result = "loss";
			else result = "draw";
		} else {
			if (awayScore > homeScore) result = "win";
			else if (awayScore < homeScore) result = "loss";
			else result = "draw";
		}
		return {
			match_id: match.sport_event.id,
			date: match.sport_event.start_time,
			opponent: home.id === teamId ? away.name : home.name,
			result,
			score: `${homeScore}-${awayScore}`,
		};
	});
}
