import React, { useState, useRef } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import CustomHeader from '../../components/CustomHeader';

import serviceAPI from "../../apis/service";
import { useAppContext } from '../../hook/context/AppContext';

const CreateCustomer = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [customerData, setCustomerData] = useState({
    FirstName: '',
    LastName: '',
    MiddleInitial: '',
    EmailAddress: '',
    Address: '',
    City: '',
    State: '',
    ZipCode: '',
    PhoneNumber: '',
    imageBytes: '',
    barcodeData: []
  });
  const [startScan, setStartScan] = useState(false);
  const sheetRef = useRef();

  const handleInputChange = (inputName, inputValue) => {
    setCustomerData({ ...customerData, [inputName]: inputValue });
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
    console.log(e);
    let barcodeData = customerData.barcodeData;
    barcodeData.push(e.data);
    setCustomerData({ ...customerData, barcodeData: barcodeData });
    Alert.alert("Scanned succussfully");
    setStartScan(false);
  };

  const handleCreate = () => {
    if (customerData.FirstName.length === 0) {
      Alert.alert("First name is empty.");
    } else if (customerData.LastName.length === 0) {
      Alert.alert("Last name is empty.");
    } else if (customerData.MiddleInitial.length === 0) {
      Alert.alert("Middle initial is empty.");
    } else if (customerData.EmailAddress.length === 0) {
      Alert.alert("Email address is empty.");
    } else if (customerData.Address.length === 0) {
      Alert.alert("Address is empty.");
    } else if (customerData.City.length === 0) {
      Alert.alert("City is empty.");
    } else if (customerData.State.length === 0) {
      Alert.alert("State is empty.");
    } else if (customerData.ZipCode.length === 0) {
      Alert.alert("Zip code is empty.");
    } else if (customerData.PhoneNumber.length === 0) {
      Alert.alert("Phone number is empty.");
    } else {
      setLoading(true);
      serviceAPI.createCustomer(customerData)
        .then(response => {
          if (response.CustomerID) {
            navigation.navigate('CreateService', { customerID: response.CustomerID });
            setCustomerData({
              FirstName: '',
              LastName: '',
              MiddleInitial: '',
              EmailAddress: '',
              Address: '',
              City: '',
              State: '',
              ZipCode: '',
              PhoneNumber: '',
              imageBytes: '',
              barcodeData: []
            });
          } else {
            Alert.alert("Create a customer failed");
          }

          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Service' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Create new customer</Text>
          <View style={styles.section}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='First Name'
                placeholderTextColor='gray'
                value={customerData.FirstName}
                onChangeText={value => handleInputChange('FirstName', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Last Name'
                placeholderTextColor='gray'
                value={customerData.LastName}
                onChangeText={value => handleInputChange('LastName', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Middle Initial'
                placeholderTextColor='gray'
                value={customerData.MiddleInitial}
                onChangeText={value => handleInputChange('MiddleInitial', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Email Address'
                placeholderTextColor='gray'
                value={customerData.EmailAddress}
                onChangeText={value => handleInputChange('EmailAddress', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Address'
                placeholderTextColor='gray'
                value={customerData.Address}
                onChangeText={value => handleInputChange('Address', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='City'
                placeholderTextColor='gray'
                value={customerData.City}
                onChangeText={value => handleInputChange('City', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='State'
                placeholderTextColor='gray'
                value={customerData.State}
                onChangeText={value => handleInputChange('State', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Zip Code'
                placeholderTextColor='gray'
                value={customerData.ZipCode}
                onChangeText={value => handleInputChange('ZipCode', value)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Phone Number'
                placeholderTextColor='gray'
                value={customerData.PhoneNumber}
                onChangeText={value => handleInputChange('PhoneNumber', value)}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitleView}>
              <Text style={styles.sectionTitle}>Driver's License</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button} onPress={() => handleAddPhoto()}>
                <Text style={styles.buttonText}>Upload photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setStartScan(true)}>
                <Text style={styles.buttonText}>Scan Barcode</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.licenseView}>
              {
                customerData.imageBytes === '' ? (
                  <FontAwesomeIcon style={styles.licenseImage} name='drivers-license-o' size={200} color='#bfbfbf' />
                ) : (
                  <Image style={styles.image} source={{ uri: customerData.imageBytes }} />
                )
              }
            </View>
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
    marginTop: 20
  },
  sectionTitleView: {
    paddingHorizontal: 20,
    marginBottom: 5
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputView: {
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
    width: 150,
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
  licenseView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e1ebf9'
  },
  scannerContainer: {
    width: '100%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e1ebf9'
  },
  camera: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1.5,
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

export default CreateCustomer;