import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, ScrollView } from 'react-native';

import CustomHeader from '../../components/CustomHeader';

import serviceAPI from "../../apis/service";
import { useAppContext } from '../../hook/context/AppContext';

const CreateService = ({ navigation, route }) => {
  const { customerID } = route.params;
  const { setLoading } = useAppContext();
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItem, setSelectedItem] = useState(false);

  useEffect(() => {
    loadServiceMenuList();
  }, []);

  const loadServiceMenuList = (itemID) => {
    let param = {};
    if (itemID) param = { SelectedItemID: itemID };

    setLoading(true);
    serviceAPI.getServiceMenus(param)
      .then(response => {
        if (response.servicemenuitems) {
          let stepList = steps;
          let index = steps.length;
          stepList.push({
            index: index,
            menuList: response.servicemenuitems
          });
          setSteps(stepList);
          setCurrentStep(index);
          setSelectedItem(false);
        } else {
          Alert.alert("Load service menu list failed");
        }

        setLoading(false);
      });
  };

  const handleClickItem = (item) => {
    if (selectedItem && item.id === selectedItem.id) setSelectedItem(false);
    else setSelectedItem(item);
  };

  const handlePrev = () => {
    let stepList = steps;
    stepList.splice(currentStep, 1);
    setCurrentStep(currentStep - 1);
    setSteps(stepList);
    setSelectedItem(false);
  };

  const handleNext = () => {
    loadServiceMenuList(selectedItem.id);
  };

  const handleCreate = () => {
    let param = {
      CustomerID: customerID,
      ServiceMenuItemID: selectedItem.id
    };
    setLoading(true);
    serviceAPI.createNewService(param)
      .then(response => {
        if (response) {
          navigation.navigate('ServiceCustomer');
        } else {
          Alert.alert("Create a service failed");
        }

        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Service' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Select service menu</Text>
          {
            steps.length === 0 || currentStep >= steps.length ? null : (
              <View style={styles.section}>
                {
                  steps[currentStep].menuList.map((item, index) => (
                    <TouchableHighlight key={index} style={styles.itemConainter} onPress={() => handleClickItem(item)}>
                      <View style={selectedItem && item.id === selectedItem.id ? styles.selectedItem : styles.item}>
                        <Text style={styles.itemText}>{item.itemName}</Text>
                      </View>
                    </TouchableHighlight>
                  ))
                }
                <View style={currentStep > 0 ? styles.btnGroup : styles.btnView}>
                  {
                    currentStep > 0 && (
                      <TouchableOpacity style={styles.prevBtn} onPress={() => handlePrev()}>
                        <Text style={styles.btnText}>Prev</Text>
                      </TouchableOpacity>)
                  }
                  {
                    selectedItem && selectedItem.isEndPoint ? (
                      <TouchableOpacity style={[styles.nextBtn, !selectedItem && styles.disabled]} onPress={() => handleCreate()} disabled={!selectedItem}>
                        <Text style={styles.btnText}>Create</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={[styles.nextBtn, !selectedItem && styles.disabled]} onPress={() => handleNext()} disabled={!selectedItem}>
                        <Text style={styles.btnText}>Next</Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
              </View>
            )
          }
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
  btnGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnView: {
    width: '100%',
    alignItems: 'flex-end'
  },
  prevBtn: {
    width: 120,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#f99f39',
  },
  nextBtn: {
    width: 120,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#f99f39',
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  disabled: {
    opacity: 0.5
  },
  hidden: {
    opacity: 0
  }
});

export default CreateService;