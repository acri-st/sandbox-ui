import { configureStore } from '@reduxjs/toolkit';
import { reducers } from '@desp-aas/desp-ui-fwk';
import projectReducer from './projectReducer';
import sandboxPreferencesReducer from './sandboxPreferencesReducer';

export const store = configureStore({
    reducer: {
        ...reducers,
        projects: projectReducer,
        sandbox_preferences: sandboxPreferencesReducer
    },
});

export type ReduxState = ReturnType<typeof store['getState']>