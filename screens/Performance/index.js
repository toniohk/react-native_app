import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, ScrollView } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';

import CustomHeader from '../../components/CustomHeader';

import performanceAPI from "../../apis/performance";
import { useAppContext } from '../../hook/context/AppContext';

const PartDetails = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [showPicker, setShowPicker] = useState({ start: false, end: false });
  const [filter, setFilter] = useState({ StartDate: moment().subtract(1, 'M').format('YYYY-MM'), EndDate: moment().format('YYYY-MM') });
  const [performanceData, setPerformanceData] = useState(null);

  const loadPerformanceData = () => {
    let params = {
      StartDate: getDateString('start', filter.StartDate),
      EndDate: getDateString('end', filter.EndDate),
      SalesmanID: 0
    };

    setLoading(true);
    performanceAPI.getPersonalMetrics(params)
      .then(response => {
        if (response.data) setPerformanceData(response);
        else {
          Alert.alert("Load performance data failed");
        }

        setLoading(false);
      });
  };

  const onChangeDate = (type, selectedDate) => {
    setShowPicker({ ...showPicker, [type]: false });
    if (selectedDate) {
      let dateString = selectedDate.getFullYear().toString() + '-' + (selectedDate.getUTCMonth() < 9 ? '0' : '') + (selectedDate.getUTCMonth() + 2).toString();
      type === 'start' ? setFilter({ ...filter, StartDate: dateString }) : setFilter({ ...filter, EndDate: dateString });
    }
  };

  const getDateString = (type, value) => {
    let date = new Date(value);
    let day = type === 'start' ? new Date(date.getFullYear(), date.getMonth() + 1, 1) : new Date(date.getFullYear(), date.getMonth() + 2, 0);
    return day.toISOString();
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Performance' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Performance</Text>
          <View style={styles.section}>
            <View style={styles.dateGroup}>
              <TouchableHighlight style={styles.dateContainer} onPress={() => setShowPicker({ ...showPicker, start: true })}>
                <View style={styles.dateView}>
                  <Text style={styles.dateText}>{filter.StartDate}</Text>
                </View>
              </TouchableHighlight>
              <Text style={styles.divider}>-</Text>
              <TouchableHighlight style={styles.dateContainer} onPress={() => setShowPicker({ ...showPicker, end: true })}>
                <View style={styles.dateView}>
                  <Text style={styles.dateText}>{filter.EndDate}</Text>
                </View>
              </TouchableHighlight>
            </View>
            {showPicker.start && (
              <MonthPicker
                onChange={(e, d) => onChangeDate('start', d)}
                value={moment(filter.StartDate).toDate()}
              />
            )}
            {showPicker.end && (
              <MonthPicker
                onChange={(e, d) => onChangeDate('end', d)}
                value={moment(filter.EndDate).toDate()}
              />
            )}
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.button} onPress={() => loadPerformanceData()}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            {performanceData && (
              <>
                <View style={styles.resultView}>
                  <Text style={styles.resultTitle}>Amount: </Text>
                  <Text style={styles.resultValue}>{performanceData.salesDollars}$</Text>
                </View>
                <View style={styles.resultView}>
                  <Text style={styles.resultTitle}>Quantity: </Text>
                  <Text style={styles.resultValue}>{performanceData.salesQuantity}</Text>
                </View>
              </>
            )}
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
    fontWeight: 'bold',
    marginBottom: 10
  },
  section: {
    width: '100%',
    marginTop: 20
  },
  dateGroup: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10
  },
  dateContainer: {
    flex: 3,
    borderRadius: 5,
    height: 50
  },
  dateView: {
    backgroundColor: '#e1ebf9',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  dateText: {
    color: '#000',
  },
  divider: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center'
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
  resultView: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  resultValue: {
    fontSize: 18
  }
});

export default PartDetails;