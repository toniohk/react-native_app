import React, { useState, useRef } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import CustomHeader from '../../components/CustomHeader';

import inventoryAPI from "../../apis/inventory";
import { useAppContext } from '../../hook/context/AppContext';

const CreateInventory = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [inventoryData, setInventoryData] = useState({
    vin: '',
    imageBytes: []
  });
  const [startScan, setStartScan] = useState(false);
  const sheetRef = useRef();

  const handleInputChange = (inputName, inputValue) => {
    setInventoryData({ ...inventoryData, [inputName]: inputValue });
  };

  const handleAddPhoto = () => {
    sheetRef.current.show();
  };

  const selectImage = () => {
    let options = {
      title: 'You can choose one image',
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {
            let imageBytes = inventoryData.imageBytes;
            imageBytes.push('data:image/png;base64,' + base64String);
            setInventoryData({ ...inventoryData, imageBytes: imageBytes });
          })
          .catch(err => console.log(err));
      }
    });
  };

  const launchCamera = () => {
    let options = {
      title: 'You can capture image from camera',
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {
            let imageBytes = inventoryData.imageBytes;
            imageBytes.push('data:image/png;base64,' + base64String);
            setInventoryData({ ...inventoryData, imageBytes: imageBytes });
          })
          .catch(err => console.log(err));
      }
    });
  };

  const onScanned = e => {
    setInventoryData({ ...inventoryData, vin: e.data });
    Alert.alert("Scanned succussfully");
    setStartScan(false);
  };

  const handleCreate = () => {
    if (inventoryData.vin.length === 0) {
      Alert.alert("Vin is empty.");
    } else {
      setLoading(true);
      inventoryAPI.createInventory(inventoryData)
        .then(response => {
          if (response) {
            navigation.navigate('Inventory');
            setInventoryData({
              vin: '',
              imageBytes: []
            });
          } else {
            Alert.alert("Create an inventory failed");
          }

          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Inventory' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Create New Inventory</Text>
          <View style={styles.section}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Input a vin'
                placeholderTextColor='gray'
                value={inventoryData.vin}
                onChangeText={value => handleInputChange('vin', value)}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setStartScan(true)}>
              <Text style={styles.buttonText}>Scan a vin from barcode</Text>
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
          </View>
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.button} onPress={() => handleAddPhoto()}>
              <Text style={styles.buttonText}>Add new photo</Text>
            </TouchableOpacity>
            {
              inventoryData.imageBytes.map((item, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: item }} />
                </View>
              ))
            }
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => handleCreate()}>
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ActionSheet
        ref={sheetRef}
        options={['Open photo gallery', 'Capture from camera', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) selectImage();
          else if (index === 1) launchCamera();
        }}
      />
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
  section: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  photoSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30
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
  button: {
    width: 190,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#262b33'
  },
  buttonText: {
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
  imageContainer: {
    width: '100%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10
  },
  createBtn: {
    width: 100,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#f99f39',
  },
  createText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default CreateInventory;