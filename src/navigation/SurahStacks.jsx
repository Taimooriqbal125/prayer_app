import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Surat from '../screens/main/Surat';
import SurahDetail from '../screens/main/SurahDetail';

const Stack = createStackNavigator();

const SurahStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="Surah"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Surah" component={Surat} />
      <Stack.Screen name="SurahVerse" component={SurahDetail} />

    </Stack.Navigator>
  );
};

export default SurahStacks;
