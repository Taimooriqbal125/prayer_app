import React from 'react';
import { render } from '@testing-library/react-native';

// 1. Defined the mock factory at the top. 
// We use a singleton inside the factory so both the component and test get the same spies.
jest.mock('@react-navigation/stack', () => {
    const Navigator = jest.fn(({ children }) => <>{children}</>);
    const Screen = jest.fn(() => null);
    const mockStack = { Navigator, Screen };
    return {
        createStackNavigator: jest.fn(() => mockStack),
    };
});

// Mock the screens
jest.mock('../screens/main/Surat', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../screens/main/SurahDetail', () => ({
    __esModule: true,
    default: () => null,
}));

// 2. Import the component under test
import SurahStacks from './SurahStacks';
import { createStackNavigator } from '@react-navigation/stack';

describe('SurahStacks', () => {
    const mockStack = createStackNavigator();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render Stack.Navigator with correct configuration', () => {
        render(<SurahStacks />);

        // Access the first call, first argument
        const navigatorProps = mockStack.Navigator.mock.calls[0][0];

        expect(navigatorProps).toMatchObject({
            initialRouteName: 'Surah',
            screenOptions: {
                headerShown: false,
            },
        });
    });

    it('should define correct screens', () => {
        render(<SurahStacks />);

        // Check for Surah screen (first call to Screen)
        expect(mockStack.Screen.mock.calls[0][0]).toMatchObject({
            name: 'Surah',
        });

        // Check for SurahVerse screen (second call to Screen)
        expect(mockStack.Screen.mock.calls[1][0]).toMatchObject({
            name: 'SurahVerse',
        });

        // Total screens should be 2
        expect(mockStack.Screen).toHaveBeenCalledTimes(2);
    });
});
