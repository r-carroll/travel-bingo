import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Your import for available bingo boards
import { boards } from '../data/boards';

function getIconType(iconType: string) {
  if (iconType === 'MCI') {
    return MaterialCommunityIcons;
  } else {
    return MaterialIcons;
  }
}

const Board = ({board, navigation}: any) => {
  const IconType = getIconType(board.iconType);
  return (
    <TouchableOpacity
      key={board.id}
      style={styles.boardItem}
      onPress={() => navigation.navigate('PlayBoard', { boardId: board.id })}
    >
        <IconType name={board.iconName} size={20} style={{padding: 5}}/>
        <Text style={styles.boardText}>{board.name}</Text>
    </TouchableOpacity>
  );
}

const SelectBoard = ({ navigation }) => {
  return (
    <View>
        <FlatList
          data={boards}
          renderItem={({item}) => <Board  navigation={navigation} board={item}/>}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
        >
        </FlatList>
    </View>
  );
};


export default SelectBoard;

const styles = StyleSheet.create({
  boardSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  boardItem: {
    width: '45%', // Adjust width based on desired grid spacing
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#f5f5f5', // Customize background color
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15, // Adjust padding as needed
  },
  boardText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Customize text color
  },
});
