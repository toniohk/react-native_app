import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

import CustomHeader from '../../../components/CustomHeader';

import personalAPI from "../../../apis/personal";
import { useAppContext } from '../../../hook/context/AppContext';

const Task = (props) => {
  const { navigation } = props;
  const { setLoading } = useAppContext();
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    loadTaskList();
  }, []);

  const loadTaskList = () => {
    setLoading(true);
    personalAPI.getTasks()
      .then(response => {
        if (response.tasks) setTaskList(response.tasks);
        else {
          Alert.alert("Load task list failed");
        }

        setLoading(false);
      });
  };

  const onCreate = () => {
    navigation.navigate('TaskEdit', { task: null });
  };

  const onEdit = (item) => {
    navigation.navigate('TaskEdit', { task: item });
  };

  const onDelete = (item) => {
    let params = {
      ...item,
      taskTask: 2
    };
    setLoading(true);
    personalAPI.editTask(params)
      .then(response => {
        console.log(response.result);
        if (response.result) {
          loadTaskList();
        } else {
          Alert.alert("Delete failed");
        }

        setLoading(false);
      });
  };

  const onComplete = (item) => {
    let params = {
      ...item,
      taskTask: 3
    };
    setLoading(true);
    personalAPI.editTask(params)
      .then(response => {
        console.log(response.result);
        if (response.result) {
          loadTaskList();
        } else {
          Alert.alert("Mark Complete failed");
        }

        setLoading(false);
      });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Completed';
      case 1:
        return 'Active';
      case 2:
        return 'Late';
      case 3:
        return 'In Progress';

      default:
        return 'In Progress';
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Personal' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Tasks</Text>
          <View style={styles.createSection}>
            <TouchableOpacity style={styles.createBtn} onPress={() => onCreate()}>
              <Text style={styles.createBtnText}>Add New</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            {
              taskList.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={[styles.itemStatusText, item.taskStatus === 0 ? styles.completed : item.taskStatus === 1 ? styles.active : item.taskStatus === 2 ? styles.late : styles.inprogress]}>{getStatusText(item.taskStatus)}</Text>
                  <Text style={styles.itemDateText}>{item.taskDueDate}</Text>
                  <View style={styles.itemDes}>
                    <Text style={styles.itemDesText}>{item.taskDetails}</Text>
                  </View>
                  <View style={styles.itemFooter}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
                      <Text style={styles.btnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item)}>
                      <Text style={styles.btnText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.completeBtn} onPress={() => onComplete(item)}>
                      <Text style={styles.btnText}>Mark Complete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  createSection: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  createBtn: {
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17a2b8',
    marginTop: 10,
    paddingHorizontal: 12
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  section: {
    width: '100%',
    marginTop: 10
  },
  itemContainer: {
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
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
  itemStatusText: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    right: 20
  },
  completed: {
    color: '#007bff'
  },
  active: {
    color: '#69bd45'
  },
  late: {
    color: '#dc3545'
  },
  inprogress: {
    color: '#f99f39'
  },
  itemDateText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemDes: {
    marginTop: 10
  },
  itemDesText: {
    fontSize: 16
  },
  itemFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  editBtn: {
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  deleteBtn: {
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  completeBtn: {
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#69bd45',
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  btnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default Task;