import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../utils/user';

export type ISandboxPreferencesState = {
    browser_os?: string
    browser_console?: string
} 
const initialState: ISandboxPreferencesState = {

}

export const sandboxPreferencesSlice = createSlice({
    name: 'sandbox_preferences',
    initialState,
    reducers: {
        setSandboxPreferences: (state, action: { payload: Partial<ISandboxPreferencesState> }) => {
            Object.assign(state, action.payload)
        }
    },
});

export const { setSandboxPreferences } = sandboxPreferencesSlice.actions;

export default sandboxPreferencesSlice.reducer;