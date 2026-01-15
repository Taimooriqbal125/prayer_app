
// Mock Dependencies
jest.mock('@react-native-community/netinfo', () => ({
    addEventListener: jest.fn(),
    fetch: jest.fn(),
}));

jest.mock('./storage', () => ({
    loadState: jest.fn(),
    saveState: jest.fn(),
}));

// Import after mocks
import { configureStore } from '@reduxjs/toolkit';
// We need to use require in tests to handle isolated modules if we want to re-run store creation logic.

describe('Redux Store', () => {
    let storeModule;
    let mockLoadState;
    let mockSaveState;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        // Re-mock logic if needed or just access the mocked module
        // Since we are mocking the module path './storage', we can access it via require
        const storageMock = require('./storage');
        mockLoadState = storageMock.loadState;
        mockSaveState = storageMock.saveState;
    });

    it('should initialize with persisted state', () => {
        // Setup mock return values for initial load
        mockLoadState.mockImplementation((key) => {
            if (key === 'app') return { isOnboarded: true };
            if (key === 'location') return { latitude: 33.68 };
            return undefined;
        });

        // Require store to trigger initialization
        storeModule = require('./store');
        const store = storeModule.store;

        const state = store.getState();
        expect(state.app.isOnboarded).toBe(true);
        expect(state.location.latitude).toBe(33.68);
    });

    it('should have all reducers registered', () => {
        storeModule = require('./store');
        const store = storeModule.store;
        const state = store.getState();

        expect(state.app).toBeDefined();
        expect(state.location).toBeDefined();
        expect(state.compass).toBeDefined();
        expect(state.qibla).toBeDefined();
        expect(state.tasbih).toBeDefined();
        expect(state.prayerTimes).toBeDefined();
        expect(state.quran).toBeDefined();
    });

    it('should save state on subscription update', () => {
        storeModule = require('./store');
        const store = storeModule.store;

        // Dispatch an action to trigger state change and subscription
        store.dispatch({ type: 'app/completeOnboarding' });

        expect(mockSaveState).toHaveBeenCalled();
        expect(mockSaveState).toHaveBeenCalledWith('app', expect.anything());
    });
});
