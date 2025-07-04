import { createSlice } from '@reduxjs/toolkit';

export type IProjectState = {
    gui_link?: string
} 
const initialState: IProjectState = {

}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProject: (state, action: { payload: Partial<IProjectState> }) => {
            Object.assign(state, action.payload)
        }
    },
});

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;