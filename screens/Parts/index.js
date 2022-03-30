import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomHeader from '../../components/CustomHeader';

import partsAPI from "../../apis/parts";
import { useAppContext } from '../../hook/context/AppContext';

const Parts = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [partList, setPartList] = useState([]);
  const [filter, setFilter] = useState({
    filtertype: 'SKU',
    filtervalue: ''
  });
  const filterItems = [
    {
      label: 'SKU',
      value: 'SKU'
    }
  ];
  useEffect(() => {
    loadPartList();
  }, []);

  const loadPartList = () => {
    setLoading(true);
    partsAPI.getParts(filter)
      .then(response => {
        if (response.parts) setPartList(response.parts);
        else {
          Alert.alert("Load part list failed");
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

  const handleClickItem = (id) => {
    navigation.navigate('PartDetails', { partID: id });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Parts' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Search parts</Text>
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
              <TouchableOpacity style={styles.button} onPress={() => loadPartList()}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.listSection}>
            {
              partList.map((item, index) => (
                <TouchableHighlight key={index} style={styles.itemConainter} onPress={() => handleClickItem(item.id)}>
                  <View style={styles.item}>
                    <Text style={styles.itemText}>{item.sku}</Text>
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

export default Parts;