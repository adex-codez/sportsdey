
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FilterType = 'all' | 'live' | 'finished' | 'upcoming';

interface TennisState {
  activeFilter: FilterType;
}

const initialState: TennisState = {
  activeFilter: 'all',
};

const tennisSlice = createSlice({
  name: 'tennis',
  initialState,
  reducers: {
    setActiveFilter: (state, action: PayloadAction<FilterType>) => {
      state.activeFilter = action.payload;
    },
  },
});

export const { setActiveFilter } = tennisSlice.actions;
export default tennisSlice.reducer;
