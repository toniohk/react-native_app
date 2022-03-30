import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import authAPI from "../../apis/auth";
import { useAppContext } from '../../hook/context/AppContext';
import { useUserContext } from '../../hook/context/UserContext';

const { height } = Dimensions.get('window');

const Home = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const { userInfo, setUserInfo } = useUserContext();

  const [menuCount, setMenuCount] = useState(3);

  const logout = () => {
    setLoading(true);
    authAPI.logout().then(() => {
      setUserInfo(false);
      setLoading(false);
    });
  };

  useEffect(() => {
    let count = 3;
    Object.keys(userInfo).forEach(key => {
      if (userInfo[key] === true) count++;
    });
    setMenuCount(count);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollViewContainer, { minHeight: 700 * menuCount / 8 }]} style={styles.scrollView}>
        <View style={styles.backGroundView} />
        <View style={[styles.navigationGroup, { height: `${68 + menuCount * 1.5}%` }]}>
          {
            userInfo.sales && (
              <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Sales')}>
                <View style={styles.navigationContainerView}>
                  <View style={styles.iconSection}>
                    <MaterialIcon name='business-center' size={40} color='black' />
                  </View>
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>SALES</Text>
                  </View>
                  <View style={styles.buttonSection}>
                    <View style={styles.button}>
                      <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            )
          }
          {
            userInfo.inventory && (
              <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Inventory')}>
                <View style={styles.navigationContainerView}>
                  <View style={styles.iconSection}>
                    <MaterialIcon name='drive-eta' size={40} color='black' />
                  </View>
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>INVENTORY</Text>
                  </View>
                  <View style={styles.buttonSection}>
                    <View style={styles.button}>
                      <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            )
          }
          {
            userInfo.service && (
              <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Service')}>
                <View style={styles.navigationContainerView}>
                  <View style={styles.iconSection}>
                    <MaterialCommunityIcon name='sign-real-estate' size={40} color='black' />
                  </View>
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>SERVICE</Text>
                  </View>
                  <View style={styles.buttonSection}>
                    <View style={styles.button}>
                      <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            )
          }
          {
            userInfo.parts && (
              <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Parts')}>
                <View style={styles.navigationContainerView}>
                  <View style={styles.iconSection}>
                    <MaterialCommunityIcon name='feature-search' size={40} color='black' />
                  </View>
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>PARTS</Text>
                  </View>
                  <View style={styles.buttonSection}>
                    <View style={styles.button}>
                      <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            )
          }
          {
            userInfo.management && (
              <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Management')}>
                <View style={styles.navigationContainerView}>
                  <View style={styles.iconSection}>
                    <FontAwesomeIcon name='line-chart' size={40} color='black' />
                  </View>
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>MANAGEMENT</Text>
                  </View>
                  <View style={styles.buttonSection}>
                    <View style={styles.button}>
                      <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            )
          }
          <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Performance')}>
            <View style={styles.navigationContainerView}>
              <View style={styles.iconSection}>
                <MaterialCommunityIcon name='scoreboard-outline' size={40} color='black' />
              </View>
              <View style={styles.titleSection}>
                <Text style={styles.title}>PERFORMANCE</Text>
              </View>
              <View style={styles.buttonSection}>
                <View style={styles.button}>
                  <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                </View>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Personal')}>
            <View style={styles.navigationContainerView}>
              <View style={styles.iconSection}>
                <FontAwesomeIcon name='tasks' size={40} color='black' />
              </View>
              <View style={styles.titleSection}>
                <Text style={styles.title}>PERSONAL</Text>
              </View>
              <View style={styles.buttonSection}>
                <View style={styles.button}>
                  <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                </View>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.navigationContainer} onPress={() => navigation.navigate('Settings')}>
            <View style={styles.navigationContainerView}>
              <View style={styles.iconSection}>
                <FeatherIcon name='settings' size={40} color='black' />
              </View>
              <View style={styles.titleSection}>
                <Text style={styles.title}>SETTINGS</Text>
              </View>
              <View style={styles.buttonSection}>
                <View style={styles.button}>
                  <EntypoIcon name='chevron-right' size={30} color='#4684de' />
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
          <MaterialCommunityIcon name='logout' size={30} color='black' />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 100
  },
  scrollView: {
    width: '100%',
    marginBottom: 80
  },
  backGroundView: {
    width: '15%',
    height: '88%',
    position: 'absolute',
    top: '6%',
    left: 0,
    backgroundColor: '#4684de',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30
  },
  navigationGroup: {
    width: '86%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '11%',
    minHeight: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 50,
  },
  navigationContainerView: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingLeft: '5%',
    paddingRight: '6%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3
  },
  iconSection: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  titleSection: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  buttonSection: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3
  },
  logoutBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20
  }
});

export default Home;