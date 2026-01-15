import React from 'react';
import { render } from '@testing-library/react-native';

// 1. Mock @react-navigation/stack singleton
jest.mock('@react-navigation/stack', () => {
    const Navigator = jest.fn(({ children }) => <>{children}</>);
    const Screen = jest.fn(() => null);
    return {
        createStackNavigator: jest.fn(() => ({ Navigator, Screen })),
    };
});

// 2. Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }) => <>{children}</>,
}));

// 3. Mock react-redux
jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

// 4. Mock Navigators
jest.mock('./AuthNavigator', () => ({ __esModule: true, default: () => null }));
jest.mock('./TabNavigator', () => ({ __esModule: true, default: () => null }));

// 5. Imports
import RootNavigator from './RootNavigator';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

describe('RootNavigator', () => {
    const mockStack = createStackNavigator();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render AuthNavigator when not onboarded', () => {
        // Set state: isOnboarded = false
        useSelector.mockImplementation((selectorFn) => selectorFn({
            app: { isOnboarded: false }
        }));

        render(<RootNavigator />);

        // Check Navigator config
        expect(mockStack.Navigator.mock.calls[0][0].screenOptions).toMatchObject({
            headerShown: false
        });

        // Check Screen is Auth
        expect(mockStack.Screen.mock.calls[0][0]).toMatchObject({
            name: 'Auth',
            component: AuthNavigator
        });

        // Should only have 1 screen
        expect(mockStack.Screen).toHaveBeenCalledTimes(1);
    });

    it('should render TabNavigator when onboarded', () => {
        // Set state: isOnboarded = true
        useSelector.mockImplementation((selectorFn) => selectorFn({
            app: { isOnboarded: true }
        }));

        render(<RootNavigator />);

        // Check Screen is App (TabNavigator)
        expect(mockStack.Screen.mock.calls[0][0]).toMatchObject({
            name: 'App',
            component: TabNavigator
        });

        // Should only have 1 screen
        expect(mockStack.Screen).toHaveBeenCalledTimes(1);
    });
});
