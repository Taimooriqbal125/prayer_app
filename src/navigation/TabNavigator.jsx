import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import Surat from '../screens/main/Surat';
import Qibla from '../screens/main/Qibla';
import Tisbih from '../screens/main/Tisbih';
import Setting from '../screens/main/Setting';
import { COLORS } from '../constants/theme';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import SurahStacks from './SurahStacks';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.disabled,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarButtonTestID: 'tab-home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="SurahStacks"
                component={SurahStacks}
                options={{
                    tabBarButtonTestID: 'tab-surah',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'book' : 'book-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Qibla"
                component={Qibla}
                options={{
                    tabBarButtonTestID: 'tab-qibla',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'compass' : 'compass-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Tisbih"
                component={Tisbih}
                options={{
                    tabBarButtonTestID: 'tab-tasbih',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialIcons
                            name="donut-large"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Settings"
                component={Setting}
                options={{
                    tabBarButtonTestID: 'tab-settings',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'settings' : 'settings-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;