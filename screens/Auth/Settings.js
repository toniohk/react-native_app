import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomHeader from '../../components/CustomHeader';

const Settings = (props) => {
  const { navigation, route } = props;
  const [apiURL, setApiURL] = useState('');
  const [companyID, setComanyID] = useState('');
  const [isLogined, setIsLogined] = useState(false);

  useEffect(async () => {
    const baseURL = await AsyncStorage.getItem('Base_URL');
    setApiURL(baseURL);
    const authInfo = JSON.parse(await AsyncStorage.getItem('Auth_Info'));
    if (authInfo && authInfo.CompanyID) setComanyID(authInfo.CompanyID);

    if (route.name === 'Settings') setIsLogined(true);
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('Base_URL', apiURL);
    const authInfo = JSON.parse(await AsyncStorage.getItem('Auth_Info'));
    if (authInfo) await AsyncStorage.setItem('Auth_Info', JSON.stringify({ ...authInfo, CompanyID: companyID }));
    else await AsyncStorage.setItem('Auth_Info', JSON.stringify({ CompanyID: companyID }));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='SETTINGS' right={isLogined} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <View style={styles.section}>
            <View style={styles.sectionTitleView}>
              <Text style={styles.sectionTitle}>API URL</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='API URL'
                placeholderTextColor='gray'
                value={apiURL}
                onChangeText={value => setApiURL(value)}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitleView}>
              <Text style={styles.sectionTitle}>Company ID</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Company ID'
                placeholderTextColor='gray'
                value={companyID}
                onChangeText={value => setComanyID(value)}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave()}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
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
  section: {
    width: '100%',
    marginBottom: 20
  },
  sectionTitleView: {
    paddingHorizontal: 20,
    marginBottom: 5
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  inputView: {
    backgroundColor: '#e1ebf9',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    color: '#000',
  },
  saveBtn: {
    width: 100,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#f99f39',
  },
  saveText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default Settings;