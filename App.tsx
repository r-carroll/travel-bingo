import '@expo/metro-runtime';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { ClickOutsideProvider } from 'react-native-click-outside';
import mobileAds, { BannerAd, BannerAdSize, MaxAdContentRating, TestIds } from 'react-native-google-mobile-ads';
import PlayBoard from './components/PlayBoard';
import SelectBoard from './components/SelectBoard';
import TitleScreen from './components/TitleScreen';
import { SoundContext } from './shared/contexts';
import { getData, storeData } from './shared/utils';

let adUnitId = '';

if (__DEV__) {
  adUnitId = TestIds.BANNER;
} else if (Platform.OS === 'ios') {
  adUnitId = 'ca-app-pub-0399277712358740/1296362654';
} else {
  adUnitId = 'ca-app-pub-0399277712358740/3431571401'
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('Yay! I have user permission to track data');
      }
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
  
    })();
  }, []);

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
      <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </React.Suspense>
     </SoundContext.Provider>
    </ClickOutsideProvider>
  );
}
