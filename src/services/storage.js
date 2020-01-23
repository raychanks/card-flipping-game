import AsyncStorage from '@react-native-community/async-storage';

async function storeData(key, value) {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    alert('Error when storing data');
  }
}

async function retrieveData(key) {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error);
    alert('Error when retrieving data');
  }
}

export { retrieveData, storeData };
