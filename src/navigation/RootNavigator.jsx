import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
const Stack = createStackNavigator();

const RootNavigator = () => {
    // Select onboarding state from persistent Redux
    const isOnboarded = useSelector((state) => state.app.isOnboarded);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isOnboarded ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <Stack.Screen name="App" component={TabNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
