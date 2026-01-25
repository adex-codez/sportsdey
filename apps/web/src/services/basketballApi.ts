import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { League, Match } from "@/types/basketball";

interface MatchesResponse {
	matches: Match[];
	total: number;
}

interface LeaguesResponse {
	leagues: League[];
}

export const basketballApi = createApi({
	reducerPath: "basketballApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://api.yourdomain.com/v1",
	}),
	tagTypes: ["Matches", "Leagues", "Favorites"],
	endpoints: (builder) => ({
		getMatches: builder.query<MatchesResponse, { status?: string } | void>({
			query: (params) => ({
				url: "/matches",
				params: params || {},
			}),
			providesTags: ["Matches"],
		}),
		getLeagues: builder.query<LeaguesResponse, void>({
			query: () => "/leagues",
			providesTags: ["Leagues"],
		}),
		getLiveMatches: builder.query<Match[], void>({
			query: () => "/matches?status=LIVE",
			providesTags: ["Matches"],
		}),
	}),
});

export const {
	useGetMatchesQuery,
	useGetLeaguesQuery,
	useGetLiveMatchesQuery,
} = basketballApi;
