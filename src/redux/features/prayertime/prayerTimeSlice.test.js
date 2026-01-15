import prayerTimeReducer, {
    loadSavedTimes,
    resetPrayerStatus,
    calculatePrayerTimes,
} from './prayerTimeSlice';
import { configureStore } from '@reduxjs/toolkit';

// Mock praytime library
jest.mock('praytime', () => {
    return {
        PrayTime: jest.fn().mockImplementation(() => ({
            location: jest.fn().mockReturnThis(),
            timezone: jest.fn().mockReturnThis(),
            adjust: jest.fn().mockReturnThis(),
            format: jest.fn().mockReturnThis(),
            round: jest.fn().mockReturnThis(),
            getTimes: jest.fn().mockReturnValue({
                fajr: '05:00 am',
                dhuhr: '12:30 pm',
                asr: '04:00 pm',
                maghrib: '06:30 pm',
                isha: '08:00 pm',
            }),
        })),
    };
});

describe('prayerTimeSlice', () => {
    const initialState = {
        today: null,
        status: 'idle',
        error: null,
    };

    it('should return the initial state', () => {
        expect(prayerTimeReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle loadSavedTimes', () => {
        const savedState = {
            today: { date: '2025-01-01', times: {} },
            status: 'succeeded',
        };
        const state = prayerTimeReducer(initialState, loadSavedTimes(savedState));
        expect(state).toEqual({
            ...initialState,
            ...savedState,
        });
    });

    it('should handle resetPrayerStatus', () => {
        const dirtyState = {
            ...initialState,
            status: 'failed',
            error: 'Some error',
        };
        const state = prayerTimeReducer(dirtyState, resetPrayerStatus());
        expect(state).toEqual(initialState);
    });

    describe('calculatePrayerTimes Thunk', () => {
        let store;

        beforeEach(() => {
            store = configureStore({
                reducer: {
                    prayerTimes: prayerTimeReducer,
                    location: (state = { latitude: 33.68, longitude: 73.04 }) => state,
                },
            });
        });

        it('should dispatch fulfilled when location is available', async () => {
            // We need a store that has location
            const result = await store.dispatch(calculatePrayerTimes(new Date('2025-01-01')));

            expect(result.type).toBe('prayerTimes/calculate/fulfilled');
            expect(result.payload.method).toBe('Karachi');
            expect(result.payload.times).toBeDefined();

            const state = store.getState().prayerTimes;
            expect(state.status).toBe('succeeded');
            expect(state.today).toEqual(result.payload);
            expect(state.error).toBeNull();
        });

        it('should dispatch rejected when location is missing', async () => {
            // Store with missing location
            const errorStore = configureStore({
                reducer: {
                    prayerTimes: prayerTimeReducer,
                    location: (state = { latitude: null, longitude: null }) => state,
                },
            });

            const result = await errorStore.dispatch(calculatePrayerTimes(new Date()));

            expect(result.type).toBe('prayerTimes/calculate/rejected');
            expect(result.error.message).toBe('Location coordinates are not available');

            const state = errorStore.getState().prayerTimes;
            expect(state.status).toBe('failed');
            expect(state.error).toBe('Location coordinates are not available');
        });

        it('should set status to loading while pending', () => {
            // We can check this by manually dispatching the pending action or checking state during async op?
            // Easier to check reducer response to pending action
            const state = prayerTimeReducer(initialState, calculatePrayerTimes.pending());
            expect(state.status).toBe('loading');
        });
    });
});
