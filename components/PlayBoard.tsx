import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Modal } from 'react-native';
import { Overlay, Icon } from '@rneui/themed';
import LottieView from "lottie-react-native";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { convertTo2DArray, shuffleArray, storeData, getData, removeData } from '../shared/utils';

import { Dimensions } from 'react-native';
import _ from 'lodash';
import { boards } from '../data/boards';
import { RFPercentage } from "react-native-responsive-fontsize";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [isBingo, setIsBingo] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    getData(board.id.toString()).then(data => {
      if (data) {
        setBoard(data);
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

  }, [board])

  const handleSquareSelection = (square) => {
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
          <Button
            title="Play Again!"
            onPress={resetBoard}
          />
          
          <Button
            title="Return to Board"
            onPress={toggleBingo}
          />

          <Button
            title="Back to board select"
            onPress={() => {
                removeData(board.id.toString());
                navigation.navigate('SelectBoard');
              } 
            }
          />
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

  return (
  <>
  <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Reset the board?</Text>
            <View style={{marginVertical: 10}}>
              <Button
                title="Reset"
                onPress={() => {
                  setModalVisible(false);
                  resetBoard();
                }}
              />
            </View>
            <View style={{marginVertical: 10}}>
              <Button
                title="Cancel"
                onPress={() => {setModalVisible(false)}}
              />
            </View>
          </View>
        </View>
      </Modal>
  <BingoVictoryOverlay />
  <View style={styles.container}>
  <Text style={styles.boardTitle}>{board.name}</Text>
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
          title="Reset Board"
          onPress={() => {setModalVisible(true)}}
      />
    </View>
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
    backgroundColor: colors.primary,
    backdropFilter: 'blur(5px)'
  },
  modalText: {
    margin: 20,
    textAlign: 'center',
    fontSize: 30, 
    fontWeight: 'bold'
  },
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: colors.text,
  },
  square: {
    width: squareWidth,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.7)', // Semi-transparent gray
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.5)', // Light gray border
    margin: 5,
  },
  selectedSquare: {
    backgroundColor: colors.accent,
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
  
