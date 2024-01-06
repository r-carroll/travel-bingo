import AsyncStorage from '@react-native-async-storage/async-storage';

export function convertTo2DArray(array: Array<any>): any {
    if (array.length < 25) {
      throw new Error("The input array must have at least 25 elements.");
    }
  
    const result = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push(array[i * 5 + j]);
      }
      result.push(row);
    }
    return result;
  }

export function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

export const storeData = (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('there was an error persisting the board', e);
    }
  };


export const getData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log('there was an error reading saved the board', e);
    }
  };
  
  export const removeData = (key: string) => {
    try {
      AsyncStorage.removeItem(key)
    } catch(e) {
      console.log('there was an error deleting the saved board', e);
    }
  }

  export const imageLibrary = {
    city: require('../assets/images/city.jpg'),
    country: require('../assets/images/road.jpg'),
    farm: require('../assets/images/farm.jpg'),
    interstate: require('../assets/images/interstate.jpg'),
}