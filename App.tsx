import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import SelectBoard from './components/SelectBoard';
import '@expo/metro-runtime';
import PlayBoard from './components/PlayBoard';
import mobileAds, { MaxAdContentRating, AppOpenAd, BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { createContext, useState, useEffect } from 'react';
import { SoundContext } from './shared/contexts';
import { getData, storeData } from './shared/utils';
import TitleScreen from './components/TitleScreen';


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
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  useEffect(() => {
    getData('soundEnabled').then(data => {
      if (data !== undefined && data !== null)
      setIsSoundEnabled(data);
    })
  },[])

  useEffect(() => {
    storeData('soundEnabled', isSoundEnabled);
  }, [isSoundEnabled])
  
  return (
    <ClickOutsideProvider>
      <SoundContext.Provider value={{ isSoundEnabled, toggleSound }}>
      <React.Suspense>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TitleScreen"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'black' },
          title: '',
          headerShown: true
        }}>
        <Stack.Screen
            name="TitleScreen"
            component={TitleScreen}
          />
        <Stack.Screen
            name="SelectBoard"
            component={SelectBoard}
            options={{title: 'Choose a board'}}
          />
        <Stack.Screen
          name="PlayBoard"
          component={PlayBoard}
          options={({ route }) => ({
            title: '',
            headerBackTitle: 'Back to Board Select',
            headerLargeStyle: false
          })}
        />
        </Stack.Navigator>
      </NavigationContainer>
      <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </React.Suspense>
     </SoundContext.Provider>
    </ClickOutsideProvider>
  );
}
