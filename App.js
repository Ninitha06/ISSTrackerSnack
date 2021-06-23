import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ISSLocationScreen from './screens/ISSLocationScreen';
import MeteorScreen from './screens/MeteorScreen';
import UpdatesScreen from './screens/UpdatesScreen';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="ISS Location" component={ISSLocationScreen} />
        <Stack.Screen name="Meteor" component={MeteorScreen} />
        <Stack.Screen name="Updates" component={UpdatesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
