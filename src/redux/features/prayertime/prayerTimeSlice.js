import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PrayTime } from 'praytime';

// Async thunk to calculate times using the current Redux state
export const calculatePrayerTimes = createAsyncThunk(
    'prayerTimes/calculate',
    async (dateInput = new Date(), { getState }) => {
        const state = getState();
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

        // 1. Get coordinates from the EXISTING location slice
        const { latitude, longitude } = state.location;

        console.log('DEBUG: Calculating prayer times for:', { latitude, longitude, date });

        if (latitude === null || longitude === null) {
            console.error('DEBUG: Location coordinates missing!');
            throw new Error('Location coordinates are not available');
        }

        // 2. Configure calculator for Pakistan
        const calculator = new PrayTime('Karachi');

        const times = calculator
            .location([latitude, longitude])
            .timezone('Asia/Karachi')
            .adjust({ asr: 'Hanafi', dhuhr: 80 }) // Hanafi method for Pakistan
            .format('12h')
            .round('nearest')
            .getTimes(date);

        console.log('DEBUG: Calculated times:', times);

        // 3. Return structured result
        return {
            date: date.toISOString().split('T')[0], // YYYY-MM-DD
            times, // The calculated prayer times object
            coordinates: { latitude, longitude },
            method: 'Karachi',
            lastCalculated: new Date().toISOString()
        };
    }
);

const initialState = {
    today: null,     // Will hold { date, times, coordinates, ... }
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const prayerTimeSlice = createSlice({
    name: 'prayerTimes',
    initialState,
    reducers: {
        // Manual persistence: Action to load saved times from MMKV
        loadSavedTimes: (state, action) => {
            // If we are loading the whole state from MMKV
            if (action.payload) {
                return { ...state, ...action.payload };
            }
            return state;
        },
        resetPrayerStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(calculatePrayerTimes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(calculatePrayerTimes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.today = action.payload; // Store the new calculation
                state.error = null;
            })
            .addCase(calculatePrayerTimes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { loadSavedTimes, resetPrayerStatus } = prayerTimeSlice.actions;
export default prayerTimeSlice.reducer;
