import React from 'react';
import { render } from '@testing-library/react-native';

// 1. Define the mock factory at the top to avoid hoisting/TDZ issues.
// Singleton pattern ensures the test and component share the same mock instances.
jest.mock('@react-navigation/stack', () => {
    const Navigator = jest.fn(({ children }) => <>{children}</>);
    const Screen = jest.fn(() => null);
    const mockStack = { Navigator, Screen };
    return {
        createStackNavigator: jest.fn(() => mockStack),
    };
});

// Mock the screen
jest.mock('../screens/onboarding/OnboardingScreen', () => ({
    __esModule: true,
    default: () => null,
}));

// 2. Import component under test
import AuthNavigator from './AuthNavigator';
import { createStackNavigator } from '@react-navigation/stack';

describe('AuthNavigator', () => {
    const mockStack = createStackNavigator();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render Stack.Navigator with correct configuration', () => {
        render(<AuthNavigator />);

        // Access first call props
        const navigatorProps = mockStack.Navigator.mock.calls[0][0];

        expect(navigatorProps).toMatchObject({
            initialRouteName: 'Onboarding',
            screenOptions: {
                headerShown: false,
            },
        });
    });

    it('should define Onboarding screen', () => {
        render(<AuthNavigator />);

        // Check first call to Screen
        expect(mockStack.Screen.mock.calls[0][0]).toMatchObject({
            name: 'Onboarding',
        });

        // Total screens should be 1
        expect(mockStack.Screen).toHaveBeenCalledTimes(1);
    });
});
