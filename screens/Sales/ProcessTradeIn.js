import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Image, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';

import CustomHeader from '../../components/CustomHeader';

import salesAPI from "../../apis/sales";
import { useAppContext } from '../../hook/context/AppContext';

const ProcessTradeIn = ({ navigation, route }) => {
  const { customerID } = route.params;
  const { setLoading } = useAppContext();
  const [tradeData, setTradeData] = useState({
    CustomerID: customerID,
    vin: '',
    VehicleType: 'Car',
    Notes: '',
    diagramImageBytes: '',
    supplementalImageBytes: []
  });
  const [startScan, setStartScan] = useState(false);
  const [vehicleDiagrams, setVehicleDiagrams] = useState({
    Car: '',
    Truck: '',
    Van: ''
  });
  const sheetRef = useRef();
  const vehicleTypes = [
    {
      label: 'Car',
      value: 'Car'
    },
    {
      label: 'Truck',
      value: 'Truck'
    },
    {
      label: 'Van',
      value: 'Van'
    }
  ];

  useEffect(() => {
    loadVehicleDiagrams();
  }, []);

  const loadVehicleDiagrams = () => {
    setLoading(true);
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.fs.exists(dirs.SDCardApplicationDir + '/files/car.png').then(exist => {
      if (exist) setVehicleDiagrams({ ...vehicleDiagrams, Car: dirs.SDCardApplicationDir + '/files/car.png' });
      else {
        salesAPI.getTradeInTemplate({ VehicleType: 'car' })
          .then(response => {
            if (response.imageURL) {
              RNFetchBlob.config({
                fileCache: true,
                addAndroidDownloads: {
                  useDownloadManager: true,
                  notification: true,
                  path: dirs.SDCardApplicationDir + '/files/car.png'
                }
              }).fetch('GET', response.imageURL)
                .then((res) => {
                  setVehicleDiagrams({ ...vehicleDiagrams, Car: res.data });
                })
                // Something went wrong:
                .catch((errorMessage, statusCode) => {
                  Alert.alert('Load vehicle diagrams failed');
                })
            } else {
              Alert.alert("Load template failed");
            }
          });
      }
    });
    RNFetchBlob.fs.exists(dirs.SDCardApplicationDir + '/files/truck.png').then(exist => {
      if (exist) setVehicleDiagrams({ ...vehicleDiagrams, Truck: dirs.SDCardApplicationDir + '/files/truck.png' });
      else {
        salesAPI.getTradeInTemplate({ VehicleType: 'truck' })
          .then(response => {
            if (response.imageURL) {
              RNFetchBlob.config({
                fileCache: true,
                addAndroidDownloads: {
                  useDownloadManager: true,
                  notification: true,
                  path: dirs.SDCardApplicationDir + '/files/truck.png'
                }
              }).fetch('GET', response.imageURL)
                .then((res) => {
                  setVehicleDiagrams({ ...vehicleDiagrams, Truck: res.data });
                })
                // Something went wrong:
                .catch((errorMessage, statusCode) => {
                  Alert.alert('Load vehicle diagrams failed');
                })
            } else {
              Alert.alert("Load template failed");
            }
          });
      }
    });
    RNFetchBlob.fs.exists(dirs.SDCardApplicationDir + '/files/van.png').then(exist => {
      if (exist) {
        setVehicleDiagrams({ ...vehicleDiagrams, Van: dirs.SDCardApplicationDir + '/files/van.png' });
        setLoading(false);
      } else {
        salesAPI.getTradeInTemplate({ VehicleType: 'van' })
          .then(response => {
            if (response.imageURL) {
              RNFetchBlob.config({
                fileCache: true,
                addAndroidDownloads: {
                  useDownloadManager: true,
                  notification: true,
                  path: dirs.SDCardApplicationDir + '/files/van.png'
                }
              }).fetch('GET', response.imageURL)
                .then((res) => {
                  setVehicleDiagrams({ ...vehicleDiagrams, Van: res.data });
                  setLoading(false);
                })
                // Something went wrong:
                .catch((errorMessage, statusCode) => {
                  Alert.alert('Load vehicle diagrams failed');
                  setLoading(false);
                })
            } else {
              Alert.alert("Load template failed");
              setLoading(false);
            }
          });
      }
    });
  };

  const handleInputChange = (inputName, inputValue) => {
    setTradeData({ ...tradeData, [inputName]: inputValue });
  };

  const onScanned = e => {
    setTradeData({ ...tradeData, vin: e.data });
    Alert.alert('Scanned succussfully');
    setStartScan(false);
  };

  const onChangeDropDown = (item) => {
    setTradeData({ ...tradeData, VehicleType: item.value });
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

  const onSketchSaved = (result, path) => {
    if (result) {
      ImgToBase64.getBase64String('file://' + path)
        .then(base64String => {
          setTradeData({ ...tradeData, diagramImageBytes: 'data:image/png;base64,' + base64String });
          RNFetchBlob.fs.unlink(path);
        })
        .catch(err => console.log(err));
    } else {
      Alert.alert('Save diagram failed');
    }
  };

  const handleCreate = () => {
    if (tradeData.vin.length === 0) {
      Alert.alert("Vin is empty.");
    } else {
      setLoading(true);
      salesAPI.createTradeInItem(tradeData)
        .then(response => {
          if (response) {
            navigation.navigate('Sales');
            setTradeData({
              CustomerID: customerID,
              vin: '',
              VehicleType: 'Car',
              Notes: '',
              diagramImageBytes: '',
              supplementalImageBytes: []
            });
          } else {
            Alert.alert("Create a trade failed");
          }

          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Sales' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Process trade-in</Text>
          <View style={styles.buttonSection}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Input a vin'
                placeholderTextColor='gray'
                value={tradeData.vin}
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
          <View style={styles.section}>
            <View style={styles.textAreaView}>
              <TextInput
                multiline
                numberOfLines={4}
                style={styles.textArea}
                placeholder='Notes'
                placeholderTextColor='gray'
                value={tradeData.Notes}
                onChangeText={value => handleInputChange('Notes', value)}
              />
            </View>
          </View>
          <View style={styles.section}>
            <DropDownPicker
              items={vehicleTypes}
              defaultValue={tradeData.VehicleType}
              containerStyle={{ height: 50 }}
              style={{ backgroundColor: '#e1ebf9' }}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{ backgroundColor: '#e1ebf9' }}
              onChangeItem={item => onChangeDropDown(item)}
            />
          </View>
          <View style={styles.section}>
            <RNSketchCanvas
              containerStyle={[styles.canvasContainer, tradeData.VehicleType !== 'Car' && styles.hidden]}
              canvasStyle={styles.canvasCar}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
              clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
              saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
              savePreference={() => {
                return {
                  filename: String(Math.ceil(Math.random() * 100000000)),
                  transparent: false,
                  imageType: 'png',
                  includeImage: true,
                  cropToImageSize: true
                }
              }}
              localSourceImage={{
                filename: vehicleDiagrams.Car,
                mode: 'AspectFill'
              }}
              onSketchSaved={(r, p) => onSketchSaved(r, p)}
            />
            <RNSketchCanvas
              containerStyle={[styles.canvasContainer, tradeData.VehicleType !== 'Truck' && styles.hidden]}
              canvasStyle={styles.canvasTruck}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
              clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
              saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
              savePreference={() => {
                return {
                  filename: String(Math.ceil(Math.random() * 100000000)),
                  transparent: false,
                  imageType: 'png',
                  includeImage: true,
                  cropToImageSize: true
                }
              }}
              localSourceImage={{
                filename: vehicleDiagrams.Truck,
                mode: 'AspectFill'
              }}
              onSketchSaved={(s, p) => console.log(s, p)}
            />
            <RNSketchCanvas
              containerStyle={[styles.canvasContainer, tradeData.VehicleType !== 'Van' && styles.hidden]}
              canvasStyle={styles.canvasVan}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
              clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
              saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
              savePreference={() => {
                return {
                  filename: String(Math.ceil(Math.random() * 100000000)),
                  transparent: false,
                  imageType: 'png',
                  includeImage: true,
                  cropToImageSize: true
                }
              }}
              localSourceImage={{
                filename: vehicleDiagrams.Van,
                mode: 'AspectFill'
              }}
              onSketchSaved={(r, p) => console.log(r, p)}
            />
          </View>
          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.button} onPress={() => handleAddPhoto()}>
              <Text style={styles.buttonText}>Add new photo</Text>
            </TouchableOpacity>
            {
              tradeData.supplementalImageBytes.map((item, index) => (
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
    marginTop: 20
  },
  buttonSection: {
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
  textAreaView: {
    backgroundColor: '#e1ebf9',
    borderRadius: 5,
    height: 100,
    justifyContent: 'center'
  },
  textArea: {
    paddingLeft: 20,
    color: '#000',
    textAlignVertical: 'top'
  },
  canvasContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dfdfdf'
  },
  canvasCar: {
    width: '100%',
    aspectRatio: 0.9,
    marginVertical: 20
  },
  canvasTruck: {
    width: '100%',
    aspectRatio: 0.9,
    marginVertical: 20
  },
  canvasVan: {
    width: '100%',
    aspectRatio: 0.6,
    marginVertical: 20
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A'
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
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
  },
  hidden: {
    display: 'none'
  }
});

export default ProcessTradeIn;