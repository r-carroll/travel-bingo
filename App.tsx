import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import SelectBoard from './components/SelectBoard';
import '@expo/metro-runtime';
import PlayBoard from './components/PlayBoard';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <React.Suspense>
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
          title: ''
        })}
      />
      </Stack.Navigator>
    </NavigationContainer>
    </React.Suspense>
  );
}
