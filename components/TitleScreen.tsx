import React, { useRef, useEffect, useDeferredValue } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Platform, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { Canvas, LinearGradient, Rect, vec, Text, useFont, useAnimatedImageValue, Image, Skia, Group, TextPath, useImage } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue, withTiming, Easing, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useFonts } from 'expo-font';

const getRandomColor = () => {
  const hexValues = [
    "#29A7E0", "#30D5C8", "#55EFCB", "#0095B6", "#41F4F2", "#65C9EF", "#158FAD", "#29F7FF",
    "#007BA7", "#34D1F5", "#2DE5E5", "#42F5C5", "#00BFFF", "#00C5CD", "#36FFE5", "#0093AF",
    "#45F5F5", "#32BCE5", "#00BCD4", "#25F5E5", "#34FFDD", "#37F5FF", "#30F5E5", "#1DE9B6",
    "#008577", "#00FFFF", "#00B2EE", "#04F757", "#00C78C", "#00CED1", "#2EFEF7", "#18FFFF",
    "#29AB87", "#009688", "#40E0D0", "#00FFFF", "#00B2EE", "#00FA9A", "#30BFBF", "#40FFFF",
    "#03C03C", "#15F4EE", "#20B2AA", "#00BFFF", "#2E8B57", "#17A589", "#3D9970", "#00CED1",
    "#20B2AA", "#48D1CC", "#2E8B57", "#20B2AA", "#66CDAA", "#3CB371", "#2F4F4F", "#228B22",
    "#1B5E20", "#006400"
  ];

  return hexValues[Math.floor(Math.random() * hexValues.length)];
};


const LandingScreen = () => {
  const textAnimation = useRef(new Animated.Value(0)).current;
  const font = useFont(require("../assets/VastShadow-Regular.ttf"), 40);
  const { width, height } = useWindowDimensions();
  const leftColor = useSharedValue('blue');
  const rightColor = useSharedValue('green');
  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value];
  }, []);

  const animation = useAnimatedImageValue(
    require("../assets/giphy.gif")
  );

  const cmLogo = useImage(require("../assets/CM-logo.gif"))

  if (animation == null) return null;

  // const bounce = () => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(textAnimation, {
  //         toValue: 15,
  //         duration: 2000,
  //         useNativeDriver: true,
  //         easing: Easing.inOut(Easing.elastic(1)),
  //       }),
  //       Animated.timing(textAnimation, {
  //         toValue: 0,
  //         duration: 2000,
  //         useNativeDriver: true,
  //         easing: Easing.inOut(Easing.elastic(1)),
  //       }),
  //     ])
  //   ).start();
  // }

  useEffect(() => {
    // Animate text
    Animated.loop(
      Animated.sequence([
        Animated.timing(textAnimation, {
          toValue: 15,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.elastic(1)),
        }),
        Animated.timing(textAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.elastic(1)),
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      leftColor.value = withTiming(getRandomColor(), { easing: Easing.linear, duration: 1000});
      rightColor.value = withTiming(getRandomColor(), { easing: Easing.linear, duration: 1000});
    }, 750);
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <>
    <View style={{opacity: 0}}>
      <Canvas style={styles.canvas} mode='continuous'>
        <Rect x={0} y={0} width={width} height={height} >
        <LinearGradient colors={colors} start={vec(0,0 )} end={vec(width, height )}/>
        </Rect>
        <Text font={font} x={20} y={80} text={'Travel Bingo'}></Text>
          {/* <Image
            image={gif}
            fit={'contain'}
            x={100}
            y={100}
            width={320}
            height={180}
          /> */}
          <Image image={cmLogo} fit={'scaleDown'} x={(width - 220) / 2} y={(height - 220) - 50} width={220} height={80} />
      </Canvas>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  canvas: {
    flex: 1
  }
});

export default LandingScreen;
