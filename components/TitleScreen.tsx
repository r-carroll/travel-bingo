import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { TextPath, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const TitleScreen = () => {
  const textPathRef = useRef();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleTextAnimation = () => {
    // Implement logic for letter pulsing/glowing
  };

  const handleIconRotation = () => {
    // Implement logic for icon rotation
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#20C997', '#56CACC', '#3498DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <Svg width={'100%'} height={300}>
        <Path
          ref={textPathRef}
          d="M10 50 Q 50 10, 90 50"
          stroke="#fff"
          strokeWidth={2}
          fill="none"
        />
        <TextPath
          href={textPathRef}
          startOffset="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={40}
          fontWeight="bold"
          fontFamily="Inter"
          style={{ fill: '#fff' }}
          onLayout={handleTextAnimation}
        >
          Travel Bingo
        </TextPath>
      </Svg>
      {/* Add travel icons here, animated using handleIconRotation */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
});

export default TitleScreen;
