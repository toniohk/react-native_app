import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, ScrollView } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomHeader from '../../../components/CustomHeader';

import personalAPI from "../../../apis/personal";
import { useAppContext } from '../../../hook/context/AppContext';

const AppointmentEdit = ({ navigation, route }) => {
  const { appointment } = route.params;
  const { setLoading } = useAppContext();
  const [appointmentData, setAppointmentData] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (appointment) setAppointmentData(appointment);
    else setAppointmentData({ appointmentDate: moment().format(), appointmentDetails: '' });
  }, []);

  const onChange = (type, value) => {
    setAppointmentData({ ...appointmentData, [type]: value });
  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) onChange('appointmentDate', selectedDate.toISOString());
  };

  const handleSave = async () => {
    let param = {
      ...appointmentData,
      appointmentTask: appointment ? 1 : 3
    };
    setLoading(true);
    personalAPI.editAppointment(param)
      .then(response => {
        if (response.result) {
          navigation.goBack();
        } else {
          Alert.alert( `${appointment ? 'Update' : 'Create'} an appointment failed`);
        }

        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Personal' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>{appointment ? 'Edit appointment' : 'Add new appointment'}</Text>
          <View style={styles.section}>
            <View style={styles.sectionTitleView}>
              <Text style={styles.sectionTitle}>Date</Text>
            </View>
            <TouchableHighlight style={styles.dateView} onPress={() => setShowPicker(true)}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{appointmentData && appointmentData.appointmentDate}</Text>
              </View>
            </TouchableHighlight>
            {showPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={(appointmentData ? moment(appointmentData.appointmentDate) : moment()).toDate()}
                mode="datetime"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitleView}>
              <Text style={styles.sectionTitle}>Details</Text>
            </View>
            <View style={styles.textAreaView}>
              <TextInput
                multiline
                numberOfLines={4}
                style={styles.textArea}
                placeholder='Details'
                placeholderTextColor='gray'
                value={appointmentData && appointmentData.appointmentDetails}
                onChangeText={value => onChange('appointmentDetails', value)}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave()}>
            <Text style={styles.saveText}>{appointment ? 'Update' : 'Create'}</Text>
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
  sectionTitleView: {
    paddingHorizontal: 20,
    marginBottom: 5
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
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
  inputView: {
    width: '100%',
    backgroundColor: '#e1ebf9',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    marginBottom: 10
  },
  textInput: {
    paddingLeft: 20,
    color: '#000',
  },
  dateView: {
    borderRadius: 5,
    height: 50
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

export default AppointmentEdit;