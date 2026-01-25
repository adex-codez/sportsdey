import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DateState {
	selectedDate: string;
}

const initialState: DateState = {
	selectedDate: new Date().toISOString(),
};

const dateSlice = createSlice({
	name: "date",
	initialState,
	reducers: {
		setDate: (state, action: PayloadAction<string>) => {
			state.selectedDate = action.payload;
		},
	},
});

export const { setDate } = dateSlice.actions;
export default dateSlice.reducer;
