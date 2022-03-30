import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableHighlight, View, ScrollView } from 'react-native';

import CustomHeader from '../../components/CustomHeader';

import serviceAPI from "../../apis/service";
import { useAppContext } from '../../hook/context/AppContext';

const SelectCustomer = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    loadCustomerList();
  }, []);

  const loadCustomerList = () => {
    setLoading(true);
    serviceAPI.getCustomers()
      .then(response => {
        if (response.customers) setCustomerList(response.customers);
        else {
          Alert.alert("Load customer list failed");
        }

        setLoading(false);
      });
  };

  const handleClickItem = (customerID) => {
    navigation.navigate('CreateService', { customerID: customerID });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Service' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Select a customer</Text>
          <View style={styles.section}>
            {
              customerList.map((item, index) => (
                <TouchableHighlight key={index} style={styles.itemConainter} onPress={() => handleClickItem(item.customerID)}>
                  <View style={styles.item}>
                    <Text style={styles.name}>{item.customerName}</Text>
                  </View>
                </TouchableHighlight>
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
  section: {
    width: '100%',
    marginTop: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemConainter: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 15
  },
  item: {
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
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
  name: {
    fontSize: 16,
  }
});

export default SelectCustomer;