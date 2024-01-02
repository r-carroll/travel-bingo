import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet, Dimensions } from 'react-native';
const { height: screenHeight } = Dimensions.get('window');
const HamburgerMenu = () => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const toggleMenu = () => {
    console.log('toggling')
    
    
    setMenuVisibility(!isMenuVisible);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.hamburger}>
        <TouchableOpacity onPress={toggleMenu}><Text style={styles.hamburgerIcon}>☰</Text></TouchableOpacity>
      </View>
      {/* Menu */}
      <View style={[styles.hamburgerMenu, {transform: [{ translateX: isMenuVisible ? 0 : 300 }]}]}>
        {/* Your menu controls go here */}
        <TouchableOpacity onPress={toggleMenu}>
          {/* Add close or cancel button */}
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default HamburgerMenu;

const styles = StyleSheet.create({
  hamburger: {
    width: 60,  
    height: 60,                          
    position: 'absolute',                                          
    top: 10,                                                    
    right: 5, 
    zIndex: 5
  },
  hamburgerIcon: {
    fontSize: 40,
    color: 'white'
  },
  hamburgerMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 10,
    height: screenHeight,
    width: '30%',
  }
});