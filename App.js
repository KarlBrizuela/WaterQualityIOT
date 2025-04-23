import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../WaterQuality/Screen/DashboardScreen';  // Correct import path
import ManageDataScreen from '../WaterQuality/Screen/ManageDataScreen';  // Correct import path

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ManageDataScreen" component={ManageDataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
