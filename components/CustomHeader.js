import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import authAPI from "../apis/auth";
import { useAppContext } from '../hook/context/AppContext';
import { useUserContext } from '../hook/context/UserContext';

const CustomLeftComponent = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <FontAwesomeIcon name='angle-left' size={30} color='white' />
    </TouchableOpacity>
  );
};

const CustomCenterComponent = ({ title }) => {
  return (
    <View style={styles.titleView}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const CustomRightComponent = ({ logout }) => {
  return (
    <TouchableOpacity onPress={() => logout()}>
      <MaterialCommunityIcon name='logout' size={30} color='white' />
    </TouchableOpacity>
  );
};

const CustomHeader = ({ title, right = true, navigation }) => {
  const { setLoading } = useAppContext();
  const { setUserInfo } = useUserContext();

  const logout = () => {
    setLoading(true);
    authAPI.logout().then(() => {
      setUserInfo(false);
      setLoading(false);
    });
  };

  return (
    <Header
      backgroundColor={'#4684de'}
      containerStyle={styles.headerContainer}
      leftComponent={<CustomLeftComponent navigation={navigation} />}
      centerComponent={<CustomCenterComponent title={title} />}
      rightComponent={right && <CustomRightComponent logout={logout} />}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    backgroundColor: '#4684de',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3
  },
  titleView: {
    height: 30,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  }
});

export default CustomHeader;