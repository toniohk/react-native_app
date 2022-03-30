import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomHeader from '../../components/CustomHeader';

import inventoryAPI from "../../apis/inventory";
import { useAppContext } from '../../hook/context/AppContext';

const InventoryList = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [inventoryList, setInventoryList] = useState([]);
  const [filter, setFilter] = useState({
    filtertype: 'modelyear',
    filtervalue: ''
  });
  const filterItems = [
    {
      label: 'Year',
      value: 'modelyear'
    },
    {
      label: 'Make',
      value: 'make'
    },
    {
      label: 'Model',
      value: 'model'
    },
    {
      label: 'Price',
      value: 'listPrice'
    },
    {
      label: 'Mileage',
      value: 'mileage'
    },
    {
      label: 'Credit Score',
      value: 'creditScore'
    }
  ];
  useEffect(() => {
    loadInventoryList();
  }, []);

  const loadInventoryList = () => {
    setLoading(true);
    inventoryAPI.getInventories(filter)
      .then(response => {
        if (response.inventories) setInventoryList(response.inventories);
        else {
          Alert.alert("Load inventory list failed");
        }

        setLoading(false);
      });
  };

  const onChangeDropDown = (item) => {
    setFilter({
      filtertype: item.value,
      filtervalue: ''
    });
  };

  const handleClickItem = (inventory) => {
    navigation.navigate('InventoryDetails', { inventory: inventory });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Inventory' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Search Inventories</Text>
          <View style={styles.filterSection}>
            <DropDownPicker
              items={filterItems}
              defaultValue={filter.filtertype}
              containerStyle={{ height: 50 }}
              style={{ backgroundColor: '#e1ebf9' }}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{ backgroundColor: '#e1ebf9' }}
              onChangeItem={item => onChangeDropDown(item)}
            />
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder='Filter value'
                placeholderTextColor='gray'
                value={filter.filtervalue}
                onChangeText={value => setFilter({ ...filter, filtervalue: value })}
              />
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.button} onPress={() => loadInventoryList()}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.listSection}>
            {
              inventoryList.map((item, index) => (
                <TouchableHighlight key={index} style={styles.itemConainter} onPress={() => handleClickItem(item)}>
                  <View style={styles.item}>
                    <Text style={styles.itemText}>{item.make}</Text>
                    <Text style={styles.itemText}>{item.model}</Text>
                    <Text style={styles.itemText}>{item.listPrice}</Text>
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
  filterSection: {
    width: '100%',
    marginTop: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  inputView: {
    backgroundColor: '#e1ebf9',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    marginTop: 10
  },
  buttonView: {
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
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    color: '#000'
  },
  listSection: {
    width: '100%',
    marginTop: 40
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
  itemText: {
    fontSize: 16,
    marginRight: 10
  }
});

export default InventoryList;