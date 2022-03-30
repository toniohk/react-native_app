import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

import CustomHeader from '../../../components/CustomHeader';

import personalAPI from "../../../apis/personal";
import { useAppContext } from '../../../hook/context/AppContext';

const Appointment = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [appointmentList, setAppointmentList] = useState([]);

  useEffect(() => {
    loadAppointmentList();
  }, []);

  const loadAppointmentList = () => {
    setLoading(true);
    personalAPI.getAppointments()
      .then(response => {
        if (response.appointments) setAppointmentList(response.appointments);
        else {
          Alert.alert("Load appointment list failed");
        }

        setLoading(false);
      });
  };

  const onCreate = () => {
    navigation.navigate('AppointmentEdit', { appointment: null });
  };

  const onEdit = (item) => {
    navigation.navigate('AppointmentEdit', { appointment: item });
  };

  const onDelete = (item) => {
    let params = {
      ...item,
      appointmentTask: 2
    };
    setLoading(true);
    personalAPI.editAppointment(params)
      .then(response => {
        console.log(response.result)
        if (response.result) {
          loadAppointmentList();
        } else {
          Alert.alert("Delete failed");
        }

        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Personal' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Appointments</Text>
          <View style={styles.createSection}>
            <TouchableOpacity style={styles.createBtn} onPress={() => onCreate()}>
              <Text style={styles.createBtnText}>Add New</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            {
              appointmentList.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.itemDateText}>{item.appointmentDate}</Text>
                  <View style={styles.itemDes}>
                    <Text style={styles.itemDesText}>{item.appointmentDetails}</Text>
                  </View>
                  <View style={styles.itemFooter}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
                      <Text style={styles.btnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item)}>
                      <Text style={styles.btnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
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
  createSection: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  createBtn: {
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17a2b8',
    marginTop: 10,
    paddingHorizontal: 12
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  section: {
    width: '100%',
    marginTop: 10
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
  itemDateText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemDes: {
    marginTop: 10
  },
  itemDesText: {
    fontSize: 16
  },
  itemFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  editBtn: {
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  deleteBtn: {
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  btnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default Appointment;