import { createSlice } from '@reduxjs/toolkit';

const phrases = [
    { id: 1, text: 'Subhanallah', translation: 'Glory be to Allah' },
    { id: 2, text: 'Alhamdulillah', translation: 'Praise be to Allah' },
    { id: 3, text: 'Allahu Akbar', translation: 'Allah is Greatest' },
    { id: 4, text: 'La ilaha illallah', translation: 'There is no god but Allah' },
];

const initialState = {
    count: 0,
    limit: 33,
    currentPhraseIndex: 0,
    phrases: phrases,
    totalCount: 0, // Cumulative count for the session
};

const tasbihSlice = createSlice({
    name: 'tasbih',
    initialState,
    reducers: {
        increment: (state) => {
            if (state.count < state.limit) {
                state.count += 1;
                state.totalCount += 1;
            }
        },
        reset: (state) => {
            state.count = 0;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
            state.count = 0; // Reset count when limit changes
        },
        nextPhrase: (state) => {
            state.currentPhraseIndex = (state.currentPhraseIndex + 1) % state.phrases.length;
            state.count = 0; // Reset count for new phrase
        },
        prevPhrase: (state) => {
            state.currentPhraseIndex = (state.currentPhraseIndex - 1 + state.phrases.length) % state.phrases.length;
            state.count = 0; // Reset count for new phrase
        },
        resetSession: (state) => {
            state.count = 0;
            state.totalCount = 0;
        }
    },
});

export const {
    increment,
    reset,
    setLimit,
    nextPhrase,
    prevPhrase,
    resetSession,
} = tasbihSlice.actions;

export default tasbihSlice.reducer;
