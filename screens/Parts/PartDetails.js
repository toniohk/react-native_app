import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Image, Text, View, ScrollView } from 'react-native';

import CustomHeader from '../../components/CustomHeader';

import partsAPI from "../../apis/parts";
import { useAppContext } from '../../hook/context/AppContext';

const PartDetails = ({ navigation, route }) => {
  const { partID } = route.params;
  const { setLoading } = useAppContext();
  const [partData, setPartData] = useState(null);

  useEffect(() => {
    loadPartData();
  }, []);

  const loadPartData = () => {
    let param = { PartID: partID };
    setLoading(true);
    partsAPI.getPartDetails(param)
      .then(response => {
        if (response.parts && response.parts.length > 0) setPartData(response.parts[0]);
        else {
          Alert.alert("Load part data failed");
        }

        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Parts' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Part Details</Text>
          {
            partData && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>SKU: </Text>
                  <Text style={styles.sectionContent}>{partData.sku}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Available Qty: </Text>
                  <Text style={styles.sectionContent}>{partData.availableQty}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Allocated Qty: </Text>
                  <Text style={styles.sectionContent}>{partData.allocatedQty}</Text>
                </View>
                {partData.imageURL && partData.imageURL.map(item => (
                  <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: item }} />
                  </View>
                ))}
              </>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  section: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  sectionContent: {
    fontSize: 16
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  }
});

export default PartDetails;