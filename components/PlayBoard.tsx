import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dimensions } from 'react-native';
import _ from 'lodash';

const { width } = Dimensions.get('window');
const squareWidth = Math.floor((width - 10 * 5) / 5); 
const fontSize = Math.floor(squareWidth * 0.15)
let iterator = 0;

function getIconType(iconType: string) {
    if (iconType === 'MCI') {
      return MaterialCommunityIcons;
    } else {
      return MaterialIcons;
    }
  }

const PlayBoard = ({navigation, route }) => {
  const [board, setBoard] = useState(route.params?.board)
  // const [bingo, setBingo] = useState(false);
  const IconType = getIconType(board.iconType);

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



// const BingoBoard = () => (
//   <FlatList
//     data={board}
//     renderItem={({ item, index }) => {
//       // Get the current row index
//       const rowIndex = Math.floor(index / numColumns);

//       return (
//         <View style={styles.row}>
//           {item.map((square, columnIndex) => {
//             const squareIndex = rowIndex * numColumns + columnIndex;
//             // Render each square with its index and content
//             return <Square key={squareIndex} item={square} />;
//           })}
//         </View>
//       );
//     }}
//   />
// );

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
  
