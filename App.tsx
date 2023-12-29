import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import SelectBoard from './components/SelectBoard';
import '@expo/metro-runtime';
import PlayBoard from './components/PlayBoard';
import mobileAds, { MaxAdContentRating, AppOpenAd, BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

mobileAds()
  .setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.G,
    tagForChildDirectedTreatment: true,
    tagForUnderAgeOfConsent: true,
    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
      });
  });

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
    <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </React.Suspense>
  );
}
