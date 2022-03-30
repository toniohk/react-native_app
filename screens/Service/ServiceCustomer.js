import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, ScrollView } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import CustomHeader from '../../components/CustomHeader';

const ServiceCustomer = (props) => {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <CustomHeader title='Service' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('ServiceCreateCustomer')}>
            <View style={styles.navigationContainerView}>
              <View style={styles.titleSection}>
                <Text style={styles.title}>New customer</Text>
              </View>
              <View style={styles.buttonSection}>
                <View style={styles.button}>
                  <EntypoIcon name='chevron-right' size={20} color='black' />
                </View>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('ServiceSelectCustomer')}>
            <View style={styles.navigationContainerView}>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Existing customer</Text>
              </View>
              <View style={styles.buttonSection}>
                <View style={styles.button}>
                  <EntypoIcon name='chevron-right' size={20} color='black' />
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  scrollView: {
    width: '100%',
    marginBottom: 80
  },
  centeredView: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 40
  },
  navigationContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    marginTop: 30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 30
  },
  navigationContainerView: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: '#262b33',
    paddingLeft: '7%',
    paddingRight: '6%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 30,
    shadowColor: '#262b33',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3
  },
  titleSection: {
    flex: 8,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  buttonSection: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
  }
});

export default ServiceCustomer;