import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FBMessaging from '@react-native-firebase/messaging';
import HomeScreen, {Engage} from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import app from '../app.json';
import {Mapp} from 'react-native-mapp-plugin';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name={'Home'}
          component={HomeScreen}
          options={{title: `Test App ${app.versionName}`}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: `Settings`}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
