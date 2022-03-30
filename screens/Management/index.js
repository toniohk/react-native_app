import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-ranges';
import { LineChart, PieChart } from 'react-native-chart-kit';

import CustomHeader from '../../components/CustomHeader';

import managementAPI from '../../apis/management';
import { useAppContext } from '../../hook/context/AppContext';

const { width } = Dimensions.get('window');

const Management = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [salesmanList, setSalemanList] = useState([{ label: 'All', value: 0 }]);
  const [selectedSalesman, setSelectedSalesman] = useState(0);
  const [date, setDate] = useState({ start: '', end: '' });
  const [chartSalesQuantity, setChartSalesQuantity] = useState(null);
  const [chartSalesDollar, setChartSalesDollar] = useState(null);
  const [chartFISalesDollar, setChartFISalesDollar] = useState(null);
  const [chartProfitAnalysis, setChartProfitAnalysis] = useState(null);

  const lineChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowClorFromDataset: false
  };

  const pieChartConfig = {
    backgroundColor: '#1cc910',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
  };

  useEffect(() => {
    let start = moment().subtract(7, 'd').format('MMMM DD, YYYY');
    let end = moment().format('MMMM DD, YYYY');
    setDate({ start: start, end: end });
    loadSalesmanList();
  }, []);

  const loadSalesmanList = () => {
    setLoading(true);
    managementAPI.getSalesmen()
      .then(response => {
        if (response.salesmen) {
          let salesmen = salesmanList;
          response.salesmen.forEach(item => {
            salesmen.push({ label: item.salesmanName, value: item.salesmanID });
          });

          setSalemanList(salesmen);
        } else {
          Alert.alert("Load salesman list failed");
        }

        loadChartsData();
      });
  };

  const loadChartsData = () => {
    let param = {
      StartDate: date.start,
      EndDate: date.end,
      SalesmanID: selectedSalesman
    }
    setLoading(true);
    // Sales Volume As Quantity
    managementAPI.getSalesVolumeAsQuantity(param)
      .then(response => {
        if (response.chartDatas) {
          setChartSalesQuantity({
            labels: response.chartDatas.map(item => item.date),
            actuals: response.chartDatas.map(item => item.actualValue),
            targets: response.chartDatas.map(item => item.targetValue)
          });
        } else {
          Alert.alert("Load data failed");
        }

        // Sales Volume As Dollar
        managementAPI.getSalesVolumeAsDollar(param)
          .then(response => {
            if (response.chartDatas) {
              setChartSalesDollar({
                labels: response.chartDatas.map(item => item.date),
                actuals: response.chartDatas.map(item => item.actualValue),
                targets: response.chartDatas.map(item => item.targetValue)
              });
            } else {
              Alert.alert("Load data failed");
            }

            // Sales InProgress
            managementAPI.getSalesInProgress(param)
              .then(response => {
                if (response.chartDatas) {

                } else {
                  Alert.alert("Load data failed");
                }

                // F And I Product Sales As Dollar
                managementAPI.getFAndIProductSalesAsDollar(param)
                  .then(response => {
                    if (response.chartDatas) {
                      setChartFISalesDollar({
                        labels: response.chartDatas.map(item => item.date),
                        actuals: response.chartDatas.map(item => item.actualValue),
                        targets: response.chartDatas.map(item => item.targetValue)
                      });
                    } else {
                      Alert.alert("Load data failed");
                    }

                    // Profit Analysis
                    managementAPI.getProfitAnalysis(param)
                      .then(response => {
                        if (response.chartDatas) {
                          setChartProfitAnalysis(response.chartDatas.map(item => ({
                            name: item.valueType,
                            value: item.valueDecimal,
                            color: '#' + Math.floor(item.valueDecimal * 16777215).toString(16),
                            legendFontColor: 'black',
                            legendFontSize: 15
                          })));
                        } else {
                          Alert.alert("Load data failed");
                        }

                        setLoading(false);
                      });
                  });
              });
          });
      });
  };

  const onChangeDates = (e) => {
    setDate({ start: e.startDate, end: e.endDate });
  };

  const onChangeDropDown = (item) => {
    setSelectedSalesman(item.value);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Management' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Management</Text>
          <View style={styles.filterSection}>
            <DatePicker
              style={styles.datePicker}
              customStyles={{
                placeholderText: styles.filterText,
                headerStyle: { backgroundColor: '#4684de' },
                contentText: styles.filterText
              }}
              centerAlign
              allowFontScaling={false}
              placeholder={date.start + '  -  ' + date.end}
              markText={'Date Range'}
              ButtonText={'Confirm'}
              mode={'range'}
              dateSplitter={'  -  '}
              onConfirm={e => onChangeDates(e)}
            />
            <DropDownPicker
              items={salesmanList}
              defaultValue={selectedSalesman}
              containerStyle={{ height: 50 }}
              style={{ backgroundColor: '#e1ebf9' }}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{ backgroundColor: '#e1ebf9' }}
              onChangeItem={item => onChangeDropDown(item)}
            />
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.button} onPress={() => loadChartsData()}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            chartSalesQuantity && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sales Volume As Quantity</Text>
                <ScrollView containerStyle={styles.chartContainer} horizontal>
                  <LineChart
                    data={{
                      labels: chartSalesQuantity.labels,
                      datasets: [
                        {
                          data: chartSalesQuantity.actuals,
                          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                          strokeWidth: 2
                        },
                        {
                          data: chartSalesQuantity.targets,
                          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                          strokeWidth: 2
                        }
                      ],
                      legend: ['Actual', 'Target']
                    }}
                    width={width * 0.2 * chartSalesQuantity.labels.length}
                    height={width * 0.6}
                    chartConfig={lineChartConfig}
                    style={styles.chartStyle}
                  />
                </ScrollView>
              </View>
            )
          }
          {
            chartSalesDollar && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sales Volume As Dollar</Text>
                <ScrollView containerStyle={styles.chartContainer} horizontal>
                  <LineChart
                    data={{
                      labels: chartSalesDollar.labels,
                      datasets: [
                        {
                          data: chartSalesDollar.actuals,
                          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                          strokeWidth: 2
                        },
                        {
                          data: chartSalesDollar.targets,
                          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                          strokeWidth: 2
                        }
                      ],
                      legend: ['Actual', 'Target']
                    }}
                    width={width * 0.2 * chartSalesDollar.labels.length}
                    height={width * 0.6}
                    chartConfig={lineChartConfig}
                    style={styles.chartStyle}
                  />
                </ScrollView>
              </View>
            )
          }
          {
            chartFISalesDollar && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>F And I Product Sales As Dollar</Text>
                <ScrollView containerStyle={styles.chartContainer} horizontal>
                  <LineChart
                    data={{
                      labels: chartFISalesDollar.labels,
                      datasets: [
                        {
                          data: chartFISalesDollar.actuals,
                          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                          strokeWidth: 2
                        },
                        {
                          data: chartFISalesDollar.targets,
                          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                          strokeWidth: 2
                        }
                      ],
                      legend: ['Actual', 'Target']
                    }}
                    width={width * 0.2 * chartFISalesDollar.labels.length}
                    height={width * 0.6}
                    chartConfig={lineChartConfig}
                    style={styles.chartStyle}
                  />
                </ScrollView>
              </View>
            )
          }
          {
            chartProfitAnalysis && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profit Analysis</Text>
                <PieChart
                  data={chartProfitAnalysis}
                  width={width * 0.8}
                  height={width * 0.6}
                  chartConfig={pieChartConfig}
                  style={styles.chartStyle}
                  accessor={'value'}
                  backgroundColor={'transparent'}
                  paddingLeft={'35'}
                />
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
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  filterSection: {
    width: '100%',
    marginVertical: 20
  },
  datePicker: {
    backgroundColor: '#e1ebf9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dfdfdf',
    marginBottom: 10
  },
  filterText: {
    fontSize: 16,
    color: 'black'
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
  section: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    backgroundColor: '#63a359',
    borderRadius: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  chartStyle: {
    marginVertical: 10
  },
  disabled: {
    opacity: 0.5
  }
});

export default Management;