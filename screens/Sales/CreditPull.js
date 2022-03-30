import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import SignatureCapture from 'react-native-signature-capture';

import CustomHeader from '../../components/CustomHeader';

import salesAPI from "../../apis/sales";
import { useAppContext } from '../../hook/context/AppContext';

const CreditPull = ({ navigation, route }) => {
  const { customerID } = route.params;
  const { setLoading } = useAppContext();
  const [creditData, setCreditData] = useState({
    CustomerID: customerID,
    IsSoftPull: true,
    IsHardPull: false,
    signData: ''
  });
  const [disableSaveSign, setDisableSaveSign] = useState(true);
  const signatureRef = useRef();
  const creditTypes = [
    { label: 'Soft Pull', value: 'IsSoftPull' },
    { label: 'Hard Pull', value: 'IsHardPull' }
  ];

  const selectedRadio = value => {
    if (value === 'IsSoftPull') setCreditData({ ...creditData, IsSoftPull: true, IsHardPull: false });
    else if (value === 'IsHardPull') setCreditData({ ...creditData, IsSoftPull: false, IsHardPull: true });
  };

  const saveSign = () => {
    signatureRef.current.saveImage();
  };

  const resetSign = () => {
    signatureRef.current.resetImage();
    setCreditData({ ...creditData, signData: '' });
    setDisableSaveSign(true);
  };

  const onDragged = () => {
    setDisableSaveSign(false);
  };

  const onSaveSignImg = (result) => {
    setCreditData({ ...creditData, signData: 'data:image/png;base64,' + result.encoded });
  };

  const handleStart = () => {
    setLoading(true);
    salesAPI.creditPull(creditData)
      .then(response => {
        if (response) {
          navigation.navigate('StartSale', { customerID: customerID });
          setCreditData({
            CustomerID: customerID,
            IsSoftPull: true,
            IsHardPull: false,
            signData: ''
          });
          resetSign();
        } else {
          Alert.alert("Credit pull failed");
        }

        setLoading(false);
      });
  };

  const handleSkip = () => {
    navigation.navigate('StartSale', { customerID: customerID });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Sales' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Allow Credit Pull</Text>
          <View style={styles.section}>
            <RadioButtonRN
              box={false}
              initial={1}
              data={creditTypes}
              selectedBtn={(e) => selectedRadio(e.value)}
            />
          </View>
          <View style={styles.signaturePadContainer}>
            <SignatureCapture
              style={styles.signaturePad}
              ref={signatureRef}
              onDragEvent={onDragged}
              onSaveEvent={onSaveSignImg}
              saveImageFileInExtStorage={false}
              showNativeButtons={false}
              showTitleLabel={false}
              backgroundColor="#e1ebf9"
              strokeColor="#000000"
              minStrokeWidth={10}
              maxStrokeWidth={10}
            />
            <View style={styles.signatureBtnContainer}>
              <TouchableOpacity style={[styles.signatureBtn, disableSaveSign && styles.disabled]} onPress={() => saveSign()} disabled={disableSaveSign}>
                <Text style={styles.signatureBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signatureBtn} onPress={() => resetSign()} >
                <Text style={styles.signatureBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={[styles.startBtn, creditData.signData === '' && styles.disabled]} onPress={() => handleStart()} disabled={creditData.signData === ''}>
            <Text style={styles.startBtnText}>Start Pull</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={() => handleSkip()}>
            <Text style={styles.skipBtnText}>Skip</Text>
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
  signaturePadContainer: {
    width: '100%',
    marginTop: 40
  },
  signaturePad: {
    width: '100%',
    aspectRatio: 1.5,
  },
  signatureBtnContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  signatureBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#eeeeee",
    margin: 10,
    borderRadius: 5
  },
  signatureBtnText: {
    fontSize: 16,
  },
  startBtn: {
    width: 120,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#f99f39',
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  disabled: {
    opacity: 0.5
  },
  skipBtn: {
    marginTop: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  skipBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4684de'
  },
});

export default CreditPull;