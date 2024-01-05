import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Modal } from 'react-native';
import { Overlay, Icon } from '@rneui/themed';
import LottieView from "lottie-react-native";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { convertTo2DArray, shuffleArray, storeData, getData, removeData } from '../shared/utils';
import {LinearGradient} from 'expo-linear-gradient';

import { Dimensions } from 'react-native';
import _ from 'lodash';
import { boards } from '../data/boards';
import { RFPercentage } from "react-native-responsive-fontsize";
import HeroComponent from './Hero';
import { Audio } from 'expo-av';
import HamburgerMenu from './HamburgerMenu';
import { SoundContext } from '../shared/contexts';

const { width } = Dimensions.get('window');
const squareWidth = Math.floor((width - 10 * 5) / 5); 
const fontSize = Math.floor(squareWidth * 0.15);

function getIconType(iconType: string) {
    if (iconType == 'MCI') {
      return MaterialCommunityIcons;
    } else if (iconType == 'FA5') {
      return FontAwesome5;
    }
    else {
      return MaterialIcons;
    }
  }


const PlayBoard = ({navigation, route }) => {
  const originalBoard = boards.find(board => board.id === route.params?.boardId);

  const prepareBoard = (): any => {
    let shuffledBoard = _.cloneDeep(originalBoard);
    let shuffledSquares = shuffleArray(shuffledBoard.squares);
    shuffledSquares = convertTo2DArray(shuffledSquares);

    shuffledBoard.squares = shuffledSquares;
    shuffledBoard.squares[2][2].label = 'Free'
    shuffledBoard.squares[2][2].iconName = 'check-circle'
    shuffledBoard.squares[2][2].iconType = 'FA5'

    return shuffledBoard;
  }

  const [board, setBoard] = useState(prepareBoard);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [initModalVisible, setInitModalVisible] = useState(false);
  const [isBingo, setIsBingo] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const { isSoundEnabled } = useContext(SoundContext);

  useEffect(() => {
    getData(board.id.toString()).then(data => {
      if (data) {
        setInitModalVisible(true);
      }
    })
  }, [])

  useEffect(() => {
    for (const row of board.squares) {
      if (row.every(square => square.isSelected)) {
        setIsBingo(true);
      }
    }
  
    for (let col = 0; col < board.squares[0].length; col++) {
      if (board.squares.every(row => row[col].isSelected)) {
        setIsBingo(true);
      }
    }
  
    if (board.squares.every((row, i) => row[i].isSelected)) {
      setIsBingo(true);
    }
    if (board.squares.every((row, i) => row[board.squares.length - 1 - i].isSelected)) {
      setIsBingo(true);
    }

  }, [board]);

  async function playSound() {
    if (isSoundEnabled) {
      const { sound } = await Audio.Sound.createAsync( require('../assets/tap.mp3')
      );
      await sound.playAsync();
    }
  }

  const handleSquareSelection = (square) => {
    playSound();
    let updatedBoard = _.cloneDeep(board)
    updatedBoard.squares.forEach(column => {
      column.forEach(currentSquare => {
        if (currentSquare.landmarkId === square.landmarkId) {
          currentSquare.isSelected = !currentSquare.isSelected;
        }
      })
    })

    setBoard(updatedBoard);
    storeData(board.id.toString(), updatedBoard);
  };

  const toggleBingo = () => {
    setIsGameOver(true)
    setIsBingo(!isBingo);
  };
  
  const resetBoard = () => {
    setIsBingo(false);
    setBoard(prepareBoard);
    removeData(board.id.toString());
  }

  const BingoVictoryOverlay = () => {  
    return (
      <View>
      <Overlay
        isVisible={isBingo && !isGameOver}
        fullScreen={false}
        
      >
          <Text style={[styles.modalText]}>BINGO!</Text>
          <LottieView
            source={require("../assets/confetti.json")}
            autoPlay
            loop
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200 }}
          />
          <View style={{paddingVertical: 10}}>
            <Button
              title="Play Again!"
              color={'#688FAB'}
              onPress={resetBoard}
            />
          </View>
          
          <View style={{paddingVertical: 10}}>
            <Button
              title="Return to Board"
              color={'#688FAB'}
              onPress={toggleBingo}
            />
          </View>

          <View style={{paddingVertical: 10}}>
            <Button
              title="Back to board select"
              color={'#688FAB'}
              onPress={() => {
                  removeData(board.id.toString());
                  navigation.navigate('SelectBoard');
                }
              }
            />
          </View>
      </Overlay>
      </View>
    );
  };  

  const renderSquare = (square) => {
    const IconType = getIconType(square.iconType)
    return (
      <TouchableOpacity
      key={square.landmarkId}
      style={[styles.square, square.isSelected ? styles.selectedSquare : styles.square]}
              onPress={() => handleSquareSelection(square)}
            >
              {square.isSelected && (
                <View  />
              )}
              <IconType
                name={square.iconName}
                size={20}
                color="#333"
                style={{padding: 5}}
              />
              <Text style={styles.squareText} numberOfLines={4}>{square.label}</Text>
            </TouchableOpacity>
    );
  }

  const InitModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={initModalVisible}
        onRequestClose={() => {
          setInitModalVisible(!initModalVisible);
        }}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Load saved game?</Text>
            <View style={{marginVertical: 10}}>
              <Button
                title="Load"
                color={'#688FAB'}
                onPress={() => {
                  getData(board.id.toString()).then(data => {
                    if (data) {
                      setInitModalVisible(false);
                      setBoard(data);
                    }
                  })
                }}
              />
            </View>
            <View style={{marginVertical: 10}}>
              <Button
                title="New Game"
                color={'#688FAB'}
                onPress={() => {
                  resetBoard();
                  removeData(board.id.toString());
                  setInitModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const ResetModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={resetModalVisible}
        onRequestClose={() => {
          setResetModalVisible(!resetModalVisible);
        }}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Reset the board?</Text>
            <View style={{marginVertical: 10}}>
              <Button
                title="Reset"
                onPress={() => {
                  setResetModalVisible(false);
                  resetBoard();
                }}
              />
            </View>
            <View style={{marginVertical: 10}}>
              <Button
                title="Cancel"
                onPress={() => {setResetModalVisible(false)}}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
  <>
  <View style={{zIndex: 5}}>
    <HamburgerMenu resetBoard={resetBoard}/>
  </View>
  <HeroComponent heroData={{type: board.type, title: board.name}} />
  <LinearGradient colors={['#000000', '#A87C26', '#667F20', '#083104', '#031602']} style={styles.linearGradient} locations={[0.0, 0.21, 0.48, 0.7986, 1]}>
  <InitModal />
  <ResetModal />
  <BingoVictoryOverlay />
  <View style={styles.container}>
  <FlatList
      data={board.squares}
      keyExtractor={(square) => square.landmarkId}
      renderItem={({item, index}) => {
        return (
          <View>
            {item.map((square, columnIndex) => {
              return renderSquare(square)
            })}
          </View>
        )
      }}
      numColumns={5} 
    />
    </View>
    <View style={styles.resetButtonContainer}>
      <Button
          color={'#688FAB'}
          title="Reset Board"
          onPress={() => {setResetModalVisible(true)}}
      />
    </View>
    </LinearGradient>
  </>
  );
};

export default PlayBoard;

const colors = {
  primary: 'rgba(255, 255, 255, 0.85)',
  accent: 'rgba(0, 128, 0, 0.5)',
  text: '#333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backdropFilter: 'blur(5px)',
  },
  modalText: {
    margin: 20,
    textAlign: 'center',
    fontSize: 30, 
    fontWeight: 'bold'
  },
  square: {
    width: squareWidth,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(222, 228, 206, 0.75)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.5)', // Light gray border
    margin: 5,
  },
  selectedSquare: {
    backgroundColor: 'gold',
  },
  unselectedSquare: {
    backgroundColor: colors.primary,
  },
  squareText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(1.3),
    width: '100%',
    textAlign: 'center',
    color: colors.text,
    paddingBottom: 10
  },
  resetButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
  },
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
  }
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
  
