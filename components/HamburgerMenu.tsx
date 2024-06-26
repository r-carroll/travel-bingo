import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useClickOutside } from 'react-native-click-outside';
import { SoundContext } from '../shared/contexts';


const HamburgerMenu = ({resetBoard}) => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [ref, setRef] = useState({});
  const screenHeight = useWindowDimensions().height;
  const screenWidth = useWindowDimensions().width;
  const menuPosition = useRef(new Animated.Value(screenWidth + 100)).current;
  const { toggleSound, isSoundEnabled } = useContext(SoundContext);

  const initialRef = useClickOutside<View>(() => {
    if (isMenuVisible) {
      toggleMenu();
    }
  });

  const toggleMenu = () => {
    const newPosition = isMenuVisible ? screenWidth + 100 : 0;
    Animated.timing(menuPosition, {
      toValue: newPosition,
      duration: 200, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
    setMenuVisibility(!isMenuVisible);
    setRef(initialRef)
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.hamburger}>
        <TouchableOpacity onPress={toggleMenu}><Text style={styles.hamburgerIcon}>☰</Text></TouchableOpacity>
      </View>
      {/* Menu */}
        <Animated.View
          ref={ref}
          style={[{
            right: menuPosition,
            transform: [{ translateX: menuPosition }],
            height: screenHeight
          }, styles.hamburgerMenu]}
        >
           <View style={styles.closeButton}>
            <TouchableOpacity onPress={toggleMenu}><MaterialCommunityIcons name="close-box-outline" size={40} color="black" /></TouchableOpacity>
          </View>
          <View style={{position: 'absolute', top: 150}}>
            <TouchableOpacity onPress={resetBoard} style={styles.hamburgerItem}>
              <Text>Reset Board</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSound} style={styles.hamburgerItem}>
              <View style={{flexDirection: 'row', alignItems: 'center', display: 'flex'}}>
                {!isSoundEnabled && <><Text style={{ lineHeight: 30 }}>Sound On </Text><MaterialIcons name="volume-up" size={24} color="black" /></>}
                {isSoundEnabled && <><Text style={{ lineHeight: 30 }}>Sound Off </Text><MaterialIcons name="volume-off" size={24} color="black" /></>}
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    zIndex: 5,
    fontFamily: 'Avenir Next'
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
    width: '40%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  hamburgerItem: {
    marginVertical: 10,
    width: '90%',
    textAlign: 'center',
    alignItems: 'center'
  },
  HamburgerItemHover: {
    backgroundColor: '#e0e0e0',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: 'black',
  },
  closeIcon: {

  }
});