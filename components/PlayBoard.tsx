import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Overlay, Icon } from '@rneui/themed';
import LottieView from "lottie-react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { convertTo2DArray, shuffleArray } from '../shared/utils';

import { Dimensions } from 'react-native';
import _ from 'lodash';

const { width } = Dimensions.get('window');
const squareWidth = Math.floor((width - 10 * 5) / 5); 
const fontSize = Math.floor(squareWidth * 0.15);

function getIconType(iconType: string) {
    if (iconType === 'MCI') {
      return MaterialCommunityIcons;
    } else {
      return MaterialIcons;
    }
  }


const PlayBoard = ({navigation, route }) => {
  const originalBoard = route.params?.board;

  const prepareBoard = (): any => {
    let shuffledBoard = _.cloneDeep(originalBoard);
    let shuffledSquares = shuffleArray(shuffledBoard.squares);
    shuffledSquares = convertTo2DArray(shuffledSquares);

    shuffledBoard.squares = shuffledSquares;

    return shuffledBoard;
  }

  const [board, setBoard] = useState(prepareBoard);
  const [isBingo, setIsBingo] = useState(false);
  const IconType = getIconType(board.iconType);

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

    setBoard(updatedBoard)
  };

  const toggleBingo = () => {
    setIsBingo(!isBingo);
  };
  
  const resetBoard = () => {
    setIsBingo(false);
    setBoard(prepareBoard);
  }

  const BingoVictoryOverlay = () => {
    if (!isBingo) return null;
  
    return (
      <View>
      <Overlay
        isVisible={isBingo}
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
            onPress={() =>
              navigation.navigate('SelectBoard')
            }
          />
      </Overlay>
      </View>
    );
  };  

  const renderSquare = (square) => (
    <TouchableOpacity
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
            />
            <Text style={styles.squareText}>{square.label}</Text>
          </TouchableOpacity>
  );

  return (
  <>
  <BingoVictoryOverlay />
  <View style={styles.container}>
  <Text style={styles.boardTitle}>{board.name}</Text>
  <FlatList
      data={board.squares}
      keyExtractor={(square) => board.squares.indexOf(square)}
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
  </>
  );
};

export default PlayBoard;

const colors = {
  primary: '#f5f5f5',
  accent: '#00ff00',
  text: '#333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    marginBottom: 20,
    color: colors.text,
  },
  square: {
    width: squareWidth,
    height: 60,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSquare: {
    backgroundColor: colors.accent,
  },
  unselectedSquare: {
    backgroundColor: colors.primary,
  },
  squareText: {
    fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
  },
});
  
