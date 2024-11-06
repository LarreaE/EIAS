import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveBoolean = async (key:string, value:boolean) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value)); // Converts boolean to string
      console.log("save successfuly key: ", key, "to", value);
      
    } catch (e) {
      console.error('Failed to save boolean to AsyncStorage', e);
    }
};

export const getBoolean = async (key:string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null; // Parses string back to boolean
    } catch (e) {
      console.error('Failed to fetch boolean from AsyncStorage', e);
      return null;
    }
};
  