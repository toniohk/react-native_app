import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create();

api.interceptors.request.use(
  async request => {
    const baseURL = await AsyncStorage.getItem('Base_URL');
    request.url = baseURL + request.url;

    const authInfo = JSON.parse(await AsyncStorage.getItem('Auth_Info'));
    if (authInfo) {
      if (request.data && request.data.userName) request.data = { ...request.data, CompanyID: authInfo.CompanyID };
      else request.data = { ...request.data, ...authInfo };
    }

    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;