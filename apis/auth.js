import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = async (authInfo) => {
  try {
    const response = await api.post('/Login/GetUserValid', authInfo);
    if (response.data.result) {
      const storedInfo = JSON.parse(await AsyncStorage.getItem('Auth_Info'));
      await AsyncStorage.setItem('Auth_Info', JSON.stringify({ ...authInfo, ...storedInfo }));
    }

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const logout = async () => {
  await AsyncStorage.removeItem('Face_Enabled');
  return true;
};

module.exports = { login, logout };