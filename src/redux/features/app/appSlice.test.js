import appReducer, { completeOnboarding, resetApp, logPrayer } from './appSlice';

describe('appSlice', () => {
    const initialState = {
        isOnboarded: false,
        prayerLogs: [],
        settings: {
            notificationsEnabled: true,
            theme: 'light',
        },
    };

    it('should return the initial state', () => {
        expect(appReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle completeOnboarding', () => {
        const previousState = { ...initialState, isOnboarded: false };
        expect(appReducer(previousState, completeOnboarding())).toEqual({
            ...initialState,
            isOnboarded: true,
        });
    });

    it('should handle resetApp', () => {
        const previousState = {
            isOnboarded: true,
            prayerLogs: [{ id: '1', date: '2025-01-01', count: 1 }],
            settings: { ...initialState.settings },
        };

        // resetApp should reset isOnboarded and logs, but keeping structure implies
        // checking the reducer logic: 
        // state.isOnboarded = false;
        // state.prayerLogs = [];
        // It does NOT explicitly reset settings in the code I analyzed.

        expect(appReducer(previousState, resetApp())).toEqual({
            ...previousState,
            isOnboarded: false,
            prayerLogs: [],
        });
    });

    it('should handle logPrayer', () => {
        const payload = { date: '2025-01-01', count: 5, type: 'daily' };

        // Date.now() is used in reducer for ID. We need to mock it or check partial match.
        // Option 1: Mock Date.now
        const realDateNow = Date.now;
        const mockTime = 1234567890;
        global.Date.now = jest.fn(() => mockTime);

        try {
            const newState = appReducer(initialState, logPrayer(payload));

            expect(newState.prayerLogs).toHaveLength(1);
            expect(newState.prayerLogs[0]).toEqual({
                id: mockTime.toString(),
                ...payload
            });
        } finally {
            global.Date.now = realDateNow;
        }
    });

    it('should append logs correctly', () => {
        const initialStateWithLogs = {
            ...initialState,
            prayerLogs: [{ id: '1', date: '2025-01-01' }]
        };

        const newState = appReducer(initialStateWithLogs, logPrayer({ date: '2025-01-02' }));
        expect(newState.prayerLogs).toHaveLength(2);
    });
});
