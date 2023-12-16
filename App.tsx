import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import SelectBoard from './components/SelectBoard';
import '@expo/metro-runtime';

const Stack = createNativeStackNavigator();
const PlayBoard = React.lazy(() => import('./components/PlayBoard'));

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectBoard">
        <Stack.Screen
          name="SelectBoard"
          component={SelectBoard}
          options={{title: 'Choose a board'}}
        />
      <Stack.Screen
        name="PlayBoard"
        component={PlayBoard}
        options={({ route }) => ({
          title: 'test', // Access board name from params
        })}
        //initialParams={{ board: {} }} // Pass selected board as param
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
