import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';

import authAPI from "../../apis/auth";
import { useAppContext } from '../../hook/context/AppContext';
import { useUserContext } from '../../hook/context/UserContext';

const Auth = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const { setUserInfo } = useUserContext();
  const [authInfo, setAuthInfo] = useState({
    userName: '',
    password: ''
  });

  useEffect(() => {

  }, []);

  const handleInputChange = (inputName, inputValue) => {
    switch (inputName) {
      case 'userName':
        setAuthInfo(authInfo => ({ ...authInfo, userName: inputValue }))
        break;
      case 'password':
        setAuthInfo(authInfo => ({ ...authInfo, password: inputValue }))
        break;
    }
  };

  const handleLogin = () => {
    if (authInfo.userName.length === 0) {
      Alert.alert("Name is empty.");
    } else if (authInfo.password.length === 0) {
      Alert.alert("Password is empty.");
    } else {
      setLoading(true);
      authAPI.login(authInfo)
        .then(response => {
          if (response.result) {
            setUserInfo({
              timeout: response.timeout,
              sales: response.sales,
              inventory: response.inventory,
              service: response.service,
              parts: response.parts,
              management: response.management
            });
            navigation.navigate('App');
            setAuthInfo({
              userName: '',
              password: ''
            });
          } else {
            Alert.alert("Login failed");
          }

          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <View style={styles.inputView}>
          <FontAwesomeIcon style={styles.icon} name='user' size={30} color='gray' />
          <TextInput
            style={styles.textInput}
            placeholder='Username'
            placeholderTextColor='gray'
            value={authInfo.userName}
            onChangeText={value => handleInputChange('userName', value)}
          />
        </View>

        <View style={styles.inputView}>
          <FontAwesomeIcon style={styles.icon} name='lock' size={30} color='gray' />
          <TextInput
            style={styles.textInput}
            placeholder='Password'
            placeholderTextColor='gray'
            secureTextEntry={true}
            value={authInfo.password}
            onChangeText={value => handleInputChange('password', value)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={() => handleLogin()}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Config')}>
        <FeatherIcon name='settings' size={30} color='black' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centeredView: {
    width: '80%',
  },
  settingsBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    right: 30
  },
  inputView: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    color: '#000',
  },
  icon: {
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
  },
  loginBtn: {
    width: '100%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#4684de',
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Auth;