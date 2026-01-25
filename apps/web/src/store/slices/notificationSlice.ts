import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

type NotificationState = {};

const initialState: NotificationState = {};

const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		showSuccess: (
			_state,
			action: PayloadAction<{ message: string; description?: string }>,
		) => {
			toast.success(action.payload.message, {
				description: action.payload.description,
				duration: 4000,
			});
		},
		showError: (
			_state,
			action: PayloadAction<{ message: string; description?: string }>,
		) => {
			toast.error(action.payload.message, {
				description: action.payload.description,
				duration: 5000,
				action: {
					label: "Dismiss",
					onClick: () => {},
				},
			});
		},
		showInfo: (
			_state,
			action: PayloadAction<{ message: string; description?: string }>,
		) => {
			toast.info(action.payload.message, {
				description: action.payload.description,
				duration: 4000,
			});
		},
		showWarning: (
			_state,
			action: PayloadAction<{ message: string; description?: string }>,
		) => {
			toast.warning(action.payload.message, {
				description: action.payload.description,
				duration: 4000,
			});
		},
	},
});

export const { showSuccess, showError, showInfo, showWarning } =
	notificationSlice.actions;
export default notificationSlice.reducer;
