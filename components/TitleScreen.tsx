import React, { useRef, useEffect, useDeferredValue } from 'react';
import { View, Text, Animated, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { Dimensions } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue, withTiming, Easing } from 'react-native-reanimated';

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
  // const animatedGradientRef = useRef(null);
  // const textAnimation = useRef(new Animated.Value(0)).current;
  const path = `M 100 150 A 100 80 0 0 1 260 150`;
  const { width, height } = useWindowDimensions();
  const leftColor = useSharedValue('blue');
  const rightColor = useSharedValue('green');
  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value];
  }, []);
  // useEffect(() => {
  //   // Animate text
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
  // }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      leftColor.value = withTiming(getRandomColor(), { easing: Easing.inOut(Easing.elastic(1))});
      rightColor.value = withTiming(getRandomColor(), { easing: Easing.inOut(Easing.elastic(1))});
    }, 750);
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <>
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={width} height={height} >
        <LinearGradient colors={colors} start={vec(0,0 )} end={vec(width, height )}/>
        </Rect>
      </Canvas>
      {/* <Image
        style={{ width: width, height: '100%' }}
        source={require('../assets/Travel-Bingo.gif')}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  canvas: {
    flex: 1
  },
  background: {
  },
  textContainer: {
    top: 200,
  },
  text: {
  },
});

export default LandingScreen;
