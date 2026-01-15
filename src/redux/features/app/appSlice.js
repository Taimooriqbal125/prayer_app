import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOnboarded: false,
    prayerLogs: [], // Array of { id, date, missedCount, type }
    settings: {
        notificationsEnabled: true,
        theme: 'light',
    },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        completeOnboarding: (state) => {
            state.isOnboarded = true;
        },
        resetApp: (state) => {
            state.isOnboarded = false;
            state.prayerLogs = [];
        },
        logPrayer: (state, action) => {
            // action.payload: { date, count, type }
            state.prayerLogs.push({
                id: Date.now().toString(),
                ...action.payload
            });
        },
    },
});

export const { completeOnboarding, resetApp, logPrayer } = appSlice.actions;
export default appSlice.reducer;
