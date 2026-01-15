import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HomeScreen from './HomeScreen';
import * as locationService from '../../services/locationService';
import * as storage from '../../redux/storage';

// Mock dependencies
jest.mock('../../components/layout/Layout', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children, header, testID }) => (
        <View testID={testID || 'screen-wrapper'}>
            {header}
            {children}
        </View>
    );
});

jest.mock('../../components/common/PrayerTimeCard', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return ({ prayerNameEnglish }) => (
        <View>
            <Text>{prayerNameEnglish}</Text>
        </View>
    );
});

jest.mock('../../components/common/PrayerCountDown', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return ({ nextPrayerName }) => (
        <View>
            <Text>Next Prayer: {nextPrayerName}</Text>
        </View>
    );
});

jest.mock('../../services/locationService', () => ({
    getCurrentLocation: jest.fn(),
}));

jest.mock('../../redux/storage', () => ({
    loadState: jest.fn(),
}));

jest.mock('../../redux/features/prayertime/prayerTimeSlice', () => ({
    calculatePrayerTimes: jest.fn(() => ({ type: 'prayerTimes/calculate' })),
    loadSavedTimes: jest.fn(() => ({ type: 'prayerTimes/loadSaved' })),
}));

jest.mock('../../redux/features/location/locationSlice', () => ({
    setLocation: jest.fn(() => ({ type: 'location/set' })),
    setLocationLoading: jest.fn(() => ({ type: 'location/setLoading' })),
    setLocationError: jest.fn(() => ({ type: 'location/setError' })),
}));

const mockStore = configureStore([]);

describe('HomeScreen', () => {
    let store;

    const initialState = {
        prayerTimes: {
            today: {
                times: {
                    fajr: '05:00 AM',
                    dhuhr: '12:30 PM',
                    asr: '03:45 PM',
                    maghrib: '06:15 PM',
                    isha: '07:30 PM',
                },
                date: '2025-01-01',
                coordinates: { latitude: 0, longitude: 0 }
            },
            status: 'succeeded',
            error: null,
        },
        location: {
            latitude: 33.68,
            longitude: 73.04,
            loading: false,
            error: null,
        },
    };

    beforeEach(() => {
        jest.useFakeTimers();
        store = mockStore(initialState);
        jest.clearAllMocks();

        // Default mocks
        locationService.getCurrentLocation.mockImplementation((success) =>
            success({ latitude: 33.68, longitude: 73.04 })
        );
        storage.loadState.mockReturnValue(null);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const renderHomeScreen = () => {
        return render(
            <Provider store={store}>
                <HomeScreen />
            </Provider>
        );
    };

    it('should render without crashing', () => {
        expect(() => renderHomeScreen()).not.toThrow();
    });

    it('should render header with date and time', () => {
        renderHomeScreen();
        // Since date/time is dynamic, we just check for elements existence or structure
        // The component renders a specific Islamic date hardcoded "3 Jumada Al-Thani 1447" in the example
        expect(screen.getByText(/Jumada Al-Thani/)).toBeTruthy();
    });

    it('should render next prayer countdown section', () => {
        renderHomeScreen();
        // With the mocked state, "Fajr" (or next prayer based on time) should be used
        // Since we didn't mock system time, "nextPrayer" calculation depends on real time.
        // However, "Prayer Time" section title should always be there.
        expect(screen.getByText('Prayer Time')).toBeTruthy();
    });

    it('should render prayer time cards', () => {
        renderHomeScreen();
        // Check for prayer names inside cards
        expect(screen.getByText('Fajr')).toBeTruthy();
        expect(screen.getByText('Dhuhr')).toBeTruthy();
        expect(screen.getByText('Maghrib')).toBeTruthy();
    });

    it('should trigger location fetch if location is missing', () => {
        // Override store to have no location
        store = mockStore({
            ...initialState,
            location: { latitude: null, longitude: null },
        });

        renderHomeScreen();

        expect(locationService.getCurrentLocation).toHaveBeenCalled();
    });

    it('should existing location does not trigger fetch', () => {
        renderHomeScreen();
        // location is present in initialState
        // Note: The useEffect dependency is [dispatch], so it runs on mount. 
        // But the condition `if (!location.latitude ...)` prevents the call.
        expect(locationService.getCurrentLocation).not.toHaveBeenCalled();
    });

    it('should display loading state when prayer times are loading', () => {
        store = mockStore({
            ...initialState,
            prayerTimes: { ...initialState.prayerTimes, status: 'loading' },
        });

        renderHomeScreen();
        expect(screen.getByText('Updating times...')).toBeTruthy();
    });

    it('should display error state when prayer times fail', () => {
        store = mockStore({
            ...initialState,
            prayerTimes: { ...initialState.prayerTimes, status: 'failed', error: 'Network Error' },
        });

        renderHomeScreen();
        expect(screen.getByText('Error: Network Error')).toBeTruthy();
    });
});
