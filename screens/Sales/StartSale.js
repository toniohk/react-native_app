import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, ScrollView } from 'react-native';

import CustomHeader from '../../components/CustomHeader';

import salesAPI from "../../apis/sales";
import { useAppContext } from '../../hook/context/AppContext';

const StartSale = ({ navigation, route }) => {
  const { customerID } = route.params;
  const { setLoading } = useAppContext();
  const [inventoryList, setInventoryList] = useState([]);
  const [saleData, setSaleData] = useState({
    CustomerID: customerID,
    InventoryID: ''
  });

  useEffect(() => {
    loadInventoryList();
  }, []);

  const loadInventoryList = () => {
    setLoading(true);
    salesAPI.getInventories()
      .then(response => {
        if (response.inventories) setInventoryList(response.inventories);
        else {
          Alert.alert("Load inventory list failed");
        }

        setLoading(false);
      });
  };

  const handleClickItem = (id) => {
    if (id === saleData.InventoryID) setSaleData({ ...saleData, InventoryID: '' });
    else setSaleData({ ...saleData, InventoryID: id });
  };

  const handleStart = () => {
    setLoading(true);
    salesAPI.startSale(saleData)
      .then(response => {
        if (response) {
          navigation.navigate('Sales');
          setSaleData({
            CustomerID: customerID,
            InventoryID: ''
          });
        }
        else {
          Alert.alert("Start a sale failed");
        }

        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Sales' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Select a inventory to start a sale</Text>
          <View style={styles.section}>
            {
              inventoryList.map((item, index) => (
                <TouchableHighlight key={index} style={styles.itemConainter} onPress={() => handleClickItem(item.id)}>
                  <View style={item.id === saleData.InventoryID ? styles.selectedItem : styles.item}>
                    <Text style={styles.itemText}>{item.make}</Text>
                    <Text style={styles.itemText}>{item.model}</Text>
                    <Text style={styles.itemText}>{item.listPrice}</Text>
                  </View>
                </TouchableHighlight>
              ))
            }
          </View>
        </View>
        <TouchableOpacity style={[styles.startBtn, saleData.InventoryID === '' && styles.disabled]} onPress={() => handleStart()} disabled={saleData.InventoryID === ''}>
          <Text style={styles.startBtnText}>Start Sale</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
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
  selectedItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 20,
    backgroundColor: '#d2d2d2'
  },
  itemText: {
    fontSize: 16,
    marginRight: 10
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
});

export default StartSale;