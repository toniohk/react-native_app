import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const BottomTabBar = ({ navigation }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesomeIcon name='home' size={30} color='white' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    width: '100%',
    height: 80,
    borderColor: '#eeeeee',
    borderWidth: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    shadowColor: 'black',
    elevation: 3,
  },
  homeBtn: {
    height: '80%',
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#4684de',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default BottomTabBar;