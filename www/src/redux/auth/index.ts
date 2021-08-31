import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../model/User';

interface AuthState {
	user: IUser | null,
	isAuthenticated: boolean | null,
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: null,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state, action: PayloadAction<{user: IUser}>) {
			state.isAuthenticated = true;
			state.user = action.payload.user;
		},
		logout(state) {
			state.isAuthenticated = false;
			state.user = null;
		}
	},
})

export const actions = authSlice.actions;
export const reducer = authSlice.reducer;
export default authSlice.reducer
