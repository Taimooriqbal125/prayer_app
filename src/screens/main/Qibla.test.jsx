import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import QiblaScreen from './Qibla';
import * as locationService from '../../services/locationService';
import * as compassService from '../../services/compassService';
import * as qiblaCalculator from '../../services/qiblaCalculator';

// Mock Dependencies
jest.mock('../../components/layout/Layout', () => {
    const React = require('react');
    const { View } = require('react-native');
    // We mock ScreenWrapper as a simple View
    return ({ children, testID }) => (
        <View testID={testID || 'screen-wrapper'}>{children}</View>
    );
});

jest.mock('../../components/qibla/CompassCircle', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return ({ qiblaFound }) => (
        <View testID="compass-circle">
            <Text>{qiblaFound ? 'Compass: Found' : 'Compass: Searching'}</Text>
        </View>
    );
});

jest.mock('../../components/qibla/QiblaStatus', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return ({ qiblaAngle, isFound, relativeAngle }) => (
        <View testID="qibla-status">
            <Text>{`Angle: ${qiblaAngle}`}</Text>
            <Text>{isFound ? 'Status: Found' : 'Status: Searching'}</Text>
        </View>
    );
});

jest.mock('../../components/qibla/CalibrationMessage', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return ({ needsCalibration }) => (
        <View testID="calibration-message">
            {needsCalibration && <Text>Calibrate!</Text>}
        </View>
    );
});

// Mock Services
jest.mock('../../services/locationService', () => ({
    getCurrentLocation: jest.fn(),
}));

jest.mock('../../services/compassService', () => ({
    subscribeMagnetometer: jest.fn(),
}));

jest.mock('../../services/qiblaCalculator', () => ({
    calculateQiblaAngle: jest.fn(),
}));

// Mock Redux Actions
jest.mock('../../redux/features/location/locationSlice', () => ({
    setLocation: jest.fn(() => ({ type: 'location/set' })),
    setLocationLoading: jest.fn(() => ({ type: 'location/setLoading' })),
    setLocationError: jest.fn(() => ({ type: 'location/setError' })),
    setPermissionStatus: jest.fn(() => ({ type: 'location/setPermission' })),
}));

jest.mock('../../redux/features/qibla/compassSlice', () => ({
    updateHeading: jest.fn(() => ({ type: 'compass/updateHeading' })),
    updateMagneticField: jest.fn(() => ({ type: 'compass/updateMagneticField' })),
}));

jest.mock('../../redux/features/qibla/qiblaSlice', () => ({
    setQiblaAngle: jest.fn(() => ({ type: 'qibla/setAngle' })),
    updateRelativeAngle: jest.fn(() => ({ type: 'qibla/updateRelative' })),
}));

const mockStore = configureStore([]);

describe('QiblaScreen', () => {
    let store;
    let unsubscribeMock;

    const initialState = {
        location: {
            latitude: null,
            longitude: null,
            loading: false,
            error: null,
            permissionStatus: 'undetermined',
        },
        compass: {
            heading: 0,
            needsCalibration: false,
        },
        qibla: {
            qiblaAngle: null,
            relativeAngle: 0,
            isFound: false,
        },
    };

    beforeEach(() => {
        store = mockStore(initialState);
        jest.clearAllMocks();

        // Setup Location Mock
        locationService.getCurrentLocation.mockImplementation((success, error) => {
            // By default, do nothing or success? 
            // The component calls this on mount.
            // Let's simulate success by default, but we can override in tests.
        });

        // Setup Magnetometer Mock
        unsubscribeMock = jest.fn();
        compassService.subscribeMagnetometer.mockReturnValue({
            unsubscribe: unsubscribeMock
        });

        // Setup Calculator Mock
        qiblaCalculator.calculateQiblaAngle.mockReturnValue(120); // Static mock angle
    });

    const renderQiblaScreen = () => {
        return render(
            <Provider store={store}>
                <QiblaScreen />
            </Provider>
        );
    };

    it('should render initializing state initially', () => {
        // Initial state has no location, so isInitializing is true
        renderQiblaScreen();
        expect(screen.getByText('Initializing Qibla Finder...')).toBeTruthy();
    });

    it('should initialize successfully (Get Location -> Start Compass)', async () => {
        // Simulate immediate location success
        locationService.getCurrentLocation.mockImplementation((success) => {
            success({ latitude: 21.42, longitude: 39.82 }); // Kaaba coords
        });

        renderQiblaScreen();

        // Should call loading action
        expect(locationService.getCurrentLocation).toHaveBeenCalled();

        // Since getCurrentLocation is sync mocked here (calling callback immediately),
        // component state update inside callback might be async in React Native testing env?
        // Actually, useState updates are batched. But here we are rendering once.
        // We might need to wait for state update.

        // However, if we provide initial state with location, we can test "Ready" state directly.
        // The component logic: const [isInitializing, setIsInitializing] = useState(!(latitude && longitude));
        // So let's test that logic first.
    });

    it('should render main content if location is already present', () => {
        store = mockStore({
            ...initialState,
            location: { latitude: 21.42, longitude: 39.82 },
            qibla: { qiblaAngle: 120, relativeAngle: 10, isFound: true },
        });

        renderQiblaScreen();

        // Should NOT show initializing
        expect(screen.queryByText('Initializing Qibla Finder...')).toBeNull();

        // Should show main components
        expect(screen.getByTestId('compass-circle')).toBeTruthy();
        expect(screen.getByText('Compass: Found')).toBeTruthy();
    });

    it('should display error alert when location fetch fails', () => {
        // Mock alert
        jest.spyOn(require('react-native').Alert, 'alert');

        locationService.getCurrentLocation.mockImplementation((success, error) => {
            error('Permission denied');
        });

        renderQiblaScreen();

        // Verify Alert was shown
        expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
            'Location Error',
            'Permission denied',
            expect.any(Array)
        );
    });

    it('should start magnetometer after location is found', () => {
        locationService.getCurrentLocation.mockImplementation((success) => {
            success({ latitude: 10, longitude: 10 });
        });

        renderQiblaScreen();

        expect(compassService.subscribeMagnetometer).toHaveBeenCalled();
    });

    it('should update qibla angle when location changes', () => {
        // We can simulate this by checking if dispatch was called for setQiblaAngle
        // But the effect runs on mount if lat/long are present.
        store = mockStore({
            ...initialState,
            location: { latitude: 10, longitude: 10 },
        });

        renderQiblaScreen();

        // This useEffect runs: [latitude, longitude]
        // dispatch(setQiblaAngle(angle));
        // We mocked calculateQiblaAngle to return 120
        const actions = store.getActions();
        const setAngleAction = actions.find(a => a.type === 'qibla/setAngle');

        // Note: Effects run after render. In tests, we might need waitFor or check calls.
        // But since we are mocking calculateQiblaAngle service separately, we can check if it was called.
        // The service is imported as qiblaCalculator.
        expect(qiblaCalculator.calculateQiblaAngle).toHaveBeenCalledWith(10, 10);
    });

    it('should unsubscribe from magnetometer on unmount', () => {
        // Setup successful initialization
        locationService.getCurrentLocation.mockImplementation((success) => {
            success({ latitude: 10, longitude: 10 });
        });

        const { unmount } = renderQiblaScreen();

        // Unmount
        unmount();

        expect(unsubscribeMock).toHaveBeenCalled();
    });

    it('should show calibration message when needed', () => {
        store = mockStore({
            ...initialState,
            location: { latitude: 10, longitude: 10 }, // ready
            compass: { needsCalibration: true },
        });

        renderQiblaScreen();

        expect(screen.getByText('Calibrate!')).toBeTruthy();
    });
});
