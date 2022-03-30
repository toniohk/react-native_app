/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import type { Node } from 'react';
import { StatusBar, LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';

import Screens from './navigation/Screens';

import AppContextProvider from './hook/context/AppContext';
import UserContextProvider from './hook/context/UserContext';

const App: () => Node = () => {
  useEffect(() => {
    SplashScreen.hide();
    LogBox.ignoreLogs(['Animated: `useNativeDriver`', 'componentWillReceiveProps']);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#4684de'} />
      <AppContextProvider>
        <UserContextProvider>
          <Screens />
        </UserContextProvider>
      </AppContextProvider>
    </NavigationContainer>
  );
};

export default App;
