import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';

import CustomHeader from '../../components/CustomHeader';

const InventoryDetails = ({ navigation, route }) => {
  const { stockNumber, modelYear, make, model, listPrice, description, estPmt, mileage, creditRangeUpper, creditRangeLower, imageURL } = route.params.inventory;

  return (
    <View style={styles.container}>
      <CustomHeader title='Inventory' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Inventory Details</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stock Number: </Text>
            <Text style={styles.sectionContent}>{stockNumber}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Year: </Text>
            <Text style={styles.sectionContent}>{modelYear}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Make: </Text>
            <Text style={styles.sectionContent}>{make}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model: </Text>
            <Text style={styles.sectionContent}>{model}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price: </Text>
            <Text style={styles.sectionContent}>{listPrice}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description: </Text>
            <Text style={styles.sectionContent}>{description}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Est Pmt: </Text>
            <Text style={styles.sectionContent}>{estPmt}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mileage: </Text>
            <Text style={styles.sectionContent}>{mileage}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CreditRange: </Text>
            <Text style={styles.sectionContent}>{creditRangeLower} - {creditRangeUpper}</Text>
          </View>
          {imageURL.map((item, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item }} />
            </View>
          ))}
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
  },
});

export default InventoryDetails;