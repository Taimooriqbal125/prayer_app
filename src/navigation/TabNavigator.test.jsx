import React from 'react';
import { render } from '@testing-library/react-native';

// 1. Singleton mock pattern for navigation
jest.mock('@react-navigation/bottom-tabs', () => {
    const Navigator = jest.fn(({ children }) => <>{children}</>);
    const Screen = jest.fn(() => null);
    const mockTab = { Navigator, Screen };
    return {
        createBottomTabNavigator: jest.fn(() => mockTab),
    };
});

// 2. Mock icons
jest.mock('@react-native-vector-icons/ionicons', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));
jest.mock('@react-native-vector-icons/material-icons', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

// 3. Mock screens
jest.mock('../screens/main/HomeScreen', () => ({ __esModule: true, default: () => null }));
jest.mock('../screens/main/Surat', () => ({ __esModule: true, default: () => null }));
jest.mock('../screens/main/Qibla', () => ({ __esModule: true, default: () => null }));
jest.mock('../screens/main/Tisbih', () => ({ __esModule: true, default: () => null }));
jest.mock('../screens/main/Setting', () => ({ __esModule: true, default: () => null }));
jest.mock('./SurahStacks', () => ({ __esModule: true, default: () => null }));

// 4. Import component under test
import TabNavigator from './TabNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { COLORS } from '../constants/theme';

describe('TabNavigator', () => {
    const mockTab = createBottomTabNavigator();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render Tab.Navigator with correct configuration', () => {
        render(<TabNavigator />);
        const navigatorProps = mockTab.Navigator.mock.calls[0][0];
        expect(navigatorProps.screenOptions).toMatchObject({
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.disabled,
        });
    });

    it('should define all 5 screens with correct names', () => {
        render(<TabNavigator />);
        const screenNames = mockTab.Screen.mock.calls.map(call => call[0].name);
        expect(screenNames).toEqual(['Home', 'SurahStacks', 'Qibla', 'Tisbih', 'Settings']);
    });

    describe('Tab Bar Icons', () => {
        let screenConfigs;

        beforeEach(() => {
            render(<TabNavigator />);
            screenConfigs = mockTab.Screen.mock.calls.map(call => call[0]);
        });

        const verifyIcon = (screenObj, focused, expectedName, IconComp = Ionicons) => {
            jest.clearAllMocks(); // Clear icon calls
            const { tabBarIcon } = screenObj.options;
            render(<>{tabBarIcon({ color: 'blue', size: 30, focused })}</>);

            const lastCall = IconComp.mock.calls[IconComp.mock.calls.length - 1];
            expect(lastCall[0]).toMatchObject({
                name: expectedName,
                color: 'blue',
                size: 30,
            });
        };

        it('should render correct Home icons', () => {
            verifyIcon(screenConfigs[0], true, 'home');
            verifyIcon(screenConfigs[0], false, 'home-outline');
        });

        it('should render correct SurahStacks icons', () => {
            verifyIcon(screenConfigs[1], true, 'book');
            verifyIcon(screenConfigs[1], false, 'book-outline');
        });

        it('should render correct Qibla icons', () => {
            verifyIcon(screenConfigs[2], true, 'compass');
            verifyIcon(screenConfigs[2], false, 'compass-outline');
        });

        it('should render correct Tisbih icon', () => {
            verifyIcon(screenConfigs[3], true, 'donut-large', MaterialIcons);
        });

        it('should render correct Settings icons', () => {
            verifyIcon(screenConfigs[4], true, 'settings');
            verifyIcon(screenConfigs[4], false, 'settings-outline');
        });
    });
});
