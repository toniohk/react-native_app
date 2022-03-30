import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import CustomHeader from '../../components/CustomHeader';

import serviceAPI from "../../apis/service";
import { useAppContext } from '../../hook/context/AppContext';

const RecallList = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [filter, setFilter] = useState({
    vin: ''
  });
  const [startScan, setStartScan] = useState(false);
  const [recallList, setRecallList] = useState([]);

  const handleInputChange = (inputName, inputValue) => {
    setFilter({ ...filter, [inputName]: inputValue });
  };

  const onScanned = e => {
    setFilter({ ...filter, vin: e.data });
    Alert.alert("Scanned succussfully");
    setStartScan(false);
  };

  const loadRecallList = () => {
    setLoading(true);
    serviceAPI.getRecalls(filter)
      .then(response => {
        if (response.recalldatas) setRecallList(response.recalldatas);
        else {
          Alert.alert("Load recall list failed");
        }

        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Service' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Search recalls</Text>
          <View style={styles.filterSection}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Input a vin'
                placeholderTextColor='gray'
                value={filter.vin}
                onChangeText={value => handleInputChange('vin', value)}
              />
            </View>
            <TouchableOpacity style={styles.scanBtn} onPress={() => setStartScan(true)}>
              <Text style={styles.scanBtnText}>Scan a vin from barcode</Text>
            </TouchableOpacity>
            {
              startScan && (
                <QRCodeScanner
                  containerStyle={styles.scannerContainer}
                  cameraStyle={styles.camera}
                  flashMode={RNCamera.Constants.FlashMode.torch}
                  cameraType={'back'}
                  onRead={onScanned}
                />
              )
            }
            <View style={styles.buttonView}>
              <TouchableOpacity style={[styles.button, filter.vin === '' && styles.disabled]} onPress={() => loadRecallList()} disabled={filter.vin === ''}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.listSection}>
            {
              recallList.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemText}>{item.summary}</Text>
                    <Text style={styles.itemText}>{item.date}</Text>
                  </View>
                  <View style={styles.itemDes}>
                    <Text style={styles.itemDesText}>{item.details}</Text>
                  </View>
                  <Text style={styles.itemServerityText}>{item.severity}</Text>
                </View>
              ))
            }
          </View>
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
    paddingVertical: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  filterSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  inputView: {
    width: '100%',
    backgroundColor: '#e1ebf9',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    marginBottom: 10
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    color: '#000',
  },
  scanBtn: {
    width: 190,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#262b33'
  },
  scanBtnText: {
    fontSize: 14,
    color: '#fff'
  },
  scannerContainer: {
    width: '100%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e1ebf9',
    marginTop: 10,
  },
  camera: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  buttonView: {
    width: '100%',
    alignItems: 'flex-end'
  },
  button: {
    width: 80,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f99f39',
    marginTop: 10
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  disabled: {
    opacity: 0.5
  },
  listSection: {
    width: '100%',
    marginTop: 40
  },
  itemContainer: {
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingVertical: 10,
    paddingLeft: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3
  },
  itemHeader: {
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 16,
    marginRight: 10
  },
  itemDes: {
    marginTop: 10
  },
  itemDesText: {
    fontSize: 16
  },
  itemServerityText: {
    fontSize: 16,
    position: 'absolute',
    top: 10,
    right: 20
  },
});

export default RecallList;