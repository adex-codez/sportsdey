import type { BasketballFilterHeadersProps } from "@/types/basketball";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BasketballState {
  activeFilter: BasketballFilterHeadersProps;
  favorites: string[];
  expandedLeagues: string[];
  selectedMatch: string | null;
}

const initialState: BasketballState = {
  activeFilter: "all",
  favorites: [],
  expandedLeagues: [],
  selectedMatch: null,
};

export const basketballSlice = createSlice({
  name: "basketball",
  initialState,
  reducers: {
    setActiveFilter: (
      state,
      action: PayloadAction<BasketballFilterHeadersProps>
    ) => {
      state.activeFilter = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const matchId = action.payload;
      const index = state.favorites.indexOf(matchId);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(matchId);
      }
    },
    toggleLeagueExpansion: (state, action: PayloadAction<string>) => {
      const leagueId = action.payload;
      const index = state.expandedLeagues.indexOf(leagueId);
      if (index > -1) {
        state.expandedLeagues.splice(index, 1);
      } else {
        state.expandedLeagues.push(leagueId);
      }
    },
    selectMatch: (state, action: PayloadAction<string | null>) => {
      state.selectedMatch = action.payload;
    },
  },
});

export const {
  setActiveFilter,
  toggleFavorite,
  toggleLeagueExpansion,
  selectMatch,
} = basketballSlice.actions;

export default basketballSlice.reducer;
