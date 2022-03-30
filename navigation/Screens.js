import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import UserInactivity from 'react-native-user-inactivity';
import BackgroundTimer from 'react-native-background-timer';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomTabBar from '../components/BottomTabBar';
import AuthScreen from '../screens/Auth';
import AuthWithFaceScreen from '../screens/Auth/AuthWithFace';
import SettingsScreen from '../screens/Auth/Settings';
import HomeScreen from '../screens/Home';
import SalesScreen from '../screens/Sales';
import SalesCustomerScreen from '../screens/Sales/SalesCustomer';
import SalesCreateCustomerScreen from '../screens/Sales/CreateCustomer';
import SalesSelectCustomerScreen from '../screens/Sales/SelectCustomer';
import CreditPullScreen from '../screens/Sales/CreditPull';
import StartSaleScreen from '../screens/Sales/StartSale';
import ProcessTradeInScreen from '../screens/Sales/ProcessTradeIn';
import InventoryScreen from '../screens/Inventory';
import CreateInventoryScreen from '../screens/Inventory/CreateInventory';
import InventoryListScreen from '../screens/Inventory/InventoryList';
import InventoryDetailsScreen from '../screens/Inventory/InventoryDetails';
import ServiceScreen from '../screens/Service';
import RecallListScreen from '../screens/Service/RecallList';
import ServiceCustomerScreen from '../screens/Service/ServiceCustomer';
import ServiceCreateCustomerScreen from '../screens/Service/CreateCustomer';
import ServiceSelectCustomerScreen from '../screens/Service/SelectCustomer';
import CreateServiceScreen from '../screens/Service/CreateService';
import PartsScreen from '../screens/Parts';
import PartDetailsScreen from '../screens/Parts/PartDetails';
import ManagementScreen from '../screens/Management';
import PerformanceScreen from '../screens/Performance';
import PersonalScreen from '../screens/Personal';
import AppointmentScreen from '../screens/Personal/Appointment';
import AppointmentEditScreen from '../screens/Personal/Appointment/Edit';
import TaskScreen from '../screens/Personal/Task';
import TaskEditScreen from '../screens/Personal/Task/Edit';
import { useAppContext } from '../hook/context/AppContext';
import { useUserContext } from '../hook/context/UserContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      mode="card"
      headerMode="screen"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Sales"
        component={SalesScreen}
      />
      <Stack.Screen
        name="SalesCustomer"
        component={SalesCustomerScreen}
      />
      <Stack.Screen
        name="SalesCreateCustomer"
        component={SalesCreateCustomerScreen}
      />
      <Stack.Screen
        name="SalesSelectCustomer"
        component={SalesSelectCustomerScreen}
      />
      <Stack.Screen
        name="CreditPull"
        component={CreditPullScreen}
      />
      <Stack.Screen
        name="StartSale"
        component={StartSaleScreen}
      />
      <Stack.Screen
        name="ProcessTradeIn"
        component={ProcessTradeInScreen}
      />
      <Stack.Screen
        name="Inventory"
        component={InventoryScreen}
      />
      <Stack.Screen
        name="CreateInventory"
        component={CreateInventoryScreen}
      />
      <Stack.Screen
        name="InventoryList"
        component={InventoryListScreen}
      />
      <Stack.Screen
        name="InventoryDetails"
        component={InventoryDetailsScreen}
      />
      <Stack.Screen
        name="Service"
        component={ServiceScreen}
      />
      <Stack.Screen
        name="RecallList"
        component={RecallListScreen}
      />
      <Stack.Screen
        name="ServiceCustomer"
        component={ServiceCustomerScreen}
      />
      <Stack.Screen
        name="ServiceCreateCustomer"
        component={ServiceCreateCustomerScreen}
      />
      <Stack.Screen
        name="ServiceSelectCustomer"
        component={ServiceSelectCustomerScreen}
      />
      <Stack.Screen
        name="CreateService"
        component={CreateServiceScreen}
      />
      <Stack.Screen
        name="Parts"
        component={PartsScreen}
      />
      <Stack.Screen
        name="PartDetails"
        component={PartDetailsScreen}
      />
      <Stack.Screen
        name="Management"
        component={ManagementScreen}
      />
      <Stack.Screen
        name="Performance"
        component={PerformanceScreen}
      />
      <Stack.Screen
        name="Personal"
        component={PersonalScreen}
      />
      <Stack.Screen
        name="Appointment"
        component={AppointmentScreen}
      />
      <Stack.Screen
        name="AppointmentEdit"
        component={AppointmentEditScreen}
      />
      <Stack.Screen
        name="Task"
        component={TaskScreen}
      />
      <Stack.Screen
        name="TaskEdit"
        component={TaskEditScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}

const AppStack = (props) => {
  const { navigation } = props;
  const { userInfo, setUserInfo } = useUserContext();
  const [active, setActive] = useState(true);
  const [timer, setTimer] = useState(1800000);

  useEffect(() => {
    if (userInfo) setTimer(userInfo.timeout * 60000);
    else navigation.navigate('Auth');
  }, [userInfo]);

  return (
    <UserInactivity
      isActive={active}
      timeForInactivity={timer}
      timeoutHandler={BackgroundTimer}
      onAction={isActive => {
        setActive(isActive);
        if (!isActive) setUserInfo(false);
      }}
      style={{ flex: 1 }}
    >
      <Tab.Navigator
        initialRouteName="HomeStack"
        tabBar={props => <BottomTabBar {...props} />}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
        />
      </Tab.Navigator>
    </UserInactivity>
  );
}

const OnboardingStack = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('Auth');
  const { loading } = useAppContext();

  useEffect(async () => {
    try {
      const baseURL = await AsyncStorage.getItem('Base_URL');
      if (baseURL === null || baseURL === undefined) await AsyncStorage.setItem('Base_URL', 'https://.../api');

      const faceLoginEnabled = await AsyncStorage.getItem('Face_Enabled');
      if (faceLoginEnabled !== null && faceLoginEnabled) {
        setInitialRouteName('AuthWithFace');
        setIsLoaded(true);
      } else {
        setInitialRouteName('Auth');
        setIsLoaded(true);
      }
    } catch (error) {
      console.log(error);
      setInitialRouteName('Auth');
      setIsLoaded(true);
    }
  }, []);

  return isLoaded && (
    <View style={{ flex: 1 }}>
      <Spinner
        visible={loading}
        textStyle={{ color: 'white' }}
      />
      <Stack.Navigator mode="card" headerMode="none" initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
        />
        <Stack.Screen
          name="AuthWithFace"
          component={AuthWithFaceScreen}
        />
        <Stack.Screen
          name="Config"
          component={SettingsScreen}
        />
        <Stack.Screen name="App" component={AppStack} />
      </Stack.Navigator>
    </View>
  );
};

export default OnboardingStack;