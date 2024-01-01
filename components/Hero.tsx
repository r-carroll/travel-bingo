import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const HeroComponent = ({ heroData }) => {
    const imageLibrary = {
        city: require('../assets/images/city.jpg'),
        country: require('../assets/images/road.jpg'),
        farm: require('../assets/images/farm.jpg'),
        interstate: require('../assets/images/interstate.jpg'),
    }
  return (
    <View style={styles.container}>
      <Image source={imageLibrary[heroData.type]} style={styles.heroImage} />
      <LinearGradient
        colors={['black', 'rgba(0, 0, 0, 0.1)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientOverlay}
      />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{heroData.title}</Text>
        {/* <Text style={styles.descriptionText}>{heroData.description}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '20%'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 10,
    color: 'white'
  },
});

export default HeroComponent;
