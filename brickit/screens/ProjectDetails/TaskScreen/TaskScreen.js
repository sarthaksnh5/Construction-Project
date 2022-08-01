import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {
  BrandColor,
  GreenText,
  GreyStroke,
  hitLink,
  TextColor,
  YellowColor,
} from '../../../constants/colors';
import {
  getData,
  initialDate,
  storeData,
} from '../../../components/AsyncStorageHelpers';
import {projectId, TaskDetial} from '../../../constants/StorageHelpers';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {useFocusEffect} from '@react-navigation/native';
import Button from '../../../components/Button';
import DatePicker from '../../../components/DatePicker';
import TextInput from '../../../components/TextInput';
import Header from '../../../components/Header';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {nameValidator} from '../../../helpers/Validators';
import {Formik} from 'formik';
import Background from '../../../components/Background';
import Dropdown from '../../../components/Dropdown';

const TaskScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(initialDate(new Date()));
  const [endDate, setEndDate] = useState(initialDate(new Date()));
  const [total, setTotal] = useState(0);
  const [complete, setComplete] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [initialData, setInitialData] = useState([]);
  const [taskName, setTaskName] = useState({value: '', error: ''});
  const [showManual, setShowManual] = useState(false);
  const [project, setProject] = useState();
  const [tasks, setTasks] = useState('Excavation: Footing Marking');

  const tasksOptions = [
    {
      label: 'Excavation: Footing Marking',
      value: 'Excavation: Footing Marking',
    },
    {label: 'Excavation: Leveling', value: 'Excavation: Leveling'},
    {
      label: 'Excavation: Excavation of soil',
      value: 'Excavation: Excavation of soil',
    },
    {label: 'Footing: PCC', value: 'Footing: PCC'},
    {label: 'Footing: Footing Casting', value: 'Footing: Footing Casting'},
    {
      label: 'Footing: Filling of excavated soil',
      value: 'Footing: Filling of excavated soil',
    },
    {
      label: 'Plinth: Levelling of Plinth',
      value: 'Plinth: Levelling of Plinth',
    },
    {
      label: 'Plinth: Plinth Beam casting',
      value: 'Plinth: Plinth Beam casting',
    },
    {label: 'Plinth: Curing', value: 'Plinth: Curing'},
    {
      label: 'Slab & Beam Casting: Reinforcement Setup',
      value: 'Slab & Beam Casting: Reinforcement Setup',
    },
    {
      label: 'Slab & Beam Casting: Shuttering',
      value: 'Slab & Beam Casting: Shuttering',
    },
    {
      label: 'Slab & Beam Casting: Concreting',
      value: 'Slab & Beam Casting: Concreting',
    },
    {
      label: 'Slab & Beam Casting: Deshuttering',
      value: 'Slab & Beam Casting: Deshuttering',
    },
    {
      label: 'Slab & Beam Casting: Curing',
      value: 'Slab & Beam Casting: Curing',
    },
    {
      label: 'Brickwork: Masonry Work',
      value: 'Brickwork: Masonry Work',
    },
    {
      label: 'Brickwork: Curing',
      value: 'Brickwork: Curing',
    },
    {
      label: 'Electrical Work',
      value: 'Electrical Work',
    },
    {
      label: 'Plumbing Work',
      value: 'Plumbing Work',
    },
    {
      label: 'Plastering',
      value: 'Plastering',
    },
    {
      label: 'Painting',
      value: 'Painting',
    },
    {
      label: 'Tiling',
      value: 'Tiling',
    },
    {
      label: 'Other',
      value: 0,
    },
  ];

  const getTasks = async () => {
    setIsLoading(true);
    await getData(projectId).then(async resp => {
      if (resp != null) {
        const {id} = resp;
        setProject(id);
        const url = `${hitLink}/project/alltask?id=${id}`;

        fetch(url, {
          method: 'GET',
        })
          .then(respon => {
            respon
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  if (message == 0) {
                    setInitialData([]);
                    ToastAndroid.showWithGravityAndOffset(
                      'No Tasks Added yet',
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                    setTotal(0);
                    setComplete(0);
                    setIncomplete(0);
                    setIsLoading(false);
                  } else {
                    const {totalTask, taskComplete, taskinComplete, taskData} =
                      message;
                    setTotal(totalTask);
                    setComplete(taskComplete);
                    setIncomplete(taskinComplete);
                    setInitialData(taskData);
                    setIsLoading(false);
                  }
                } else {
                  console.log(message);
                  setIsLoading(false);
                }
              })
              .catch(e => {
                console.log(e);
                setIsLoading(false);
              });
          })
          .catch(e => {
            console.log(e);
            setIsLoading(false);
          });
      }
    });
  };

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/alltask`;
    let fd = new FormData();
    fd.append('startDate', startDate);
    fd.append('endDate', endDate);
    if (tasks == 0) {
      fd.append('name', values.taskName);
    } else {
      fd.append('name', tasks);
    }

    fd.append('id', project);
    fd.append('status', 0);

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              setModalVisible(false);
              setSubmitting(false);
              getTasks();
            } else {
              console.log(message);
              alert('Server Error');
              setSubmitting(false);
            }
          })
          .catch(e => {
            console.log(e);
            setSubmitting(false);
          });
      })
      .catch(e => {
        console.log(e);
        setSubmitting(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getTasks();
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  const taskDetails = (id, name) => {
    storeData(TaskDetial, {id: id, name: name});
    navigation.navigate('TaskDetails');
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => taskDetails(item.id, item.name)}
      style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.leftContainer}>
          <View style={{width: '20%', justifyContent: 'center'}}>
            <Text style={styles.text}>{item.start}</Text>
          </View>
          <View style={{width: '60%', justifyContent: 'center'}}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
          <View
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>{item.end}</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.text}>{item.progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.mainContainer}>
        <View style={styles.detailsContainer}>
          <View style={styles.dataContainer}>
            <Text
              style={[
                styles.text,
                {color: TextColor},
                Platform.OS == 'ios' ? {fontSize: 15} : {fontSize: 17},
              ]}>
              Total
            </Text>
            <Text style={[styles.text, {color: TextColor, fontSize: 15}]}>
              {total}
            </Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.dataContainer}>
            <Text
              style={[
                styles.text,
                {color: YellowColor},
                Platform.OS == 'ios' ? {fontSize: 15} : {fontSize: 17},
              ]}>
              Running
            </Text>
            <Text style={[styles.text, {color: YellowColor, fontSize: 15}]}>
              {incomplete}
            </Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.dataContainer}>
            <Text
              style={[
                styles.text,
                {color: GreenText},
                Platform.OS == 'ios' ? {fontSize: 15} : {fontSize: 17},
              ]}>
              Completed
            </Text>
            <Text style={[styles.text, {color: GreenText, fontSize: 15}]}>
              {complete}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.heading}>
        <View
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Starts</Text>
        </View>
        <View style={{width: '45%', justifyContent: 'center'}}>
          <Text style={styles.text}>Task Name</Text>
        </View>
        <View style={{width: '15%', justifyContent: 'center'}}>
          <Text style={styles.text}>Ends</Text>
        </View>
        <View
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Progress</Text>
        </View>
      </View>
      {initialData.length > 0 ? (
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          data={initialData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No Task initialized yet</Text>
      )}
      <View style={styles.bottomContainer}>
        <Button
          text="ADD a New Task"
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Formik
          initialValues={{taskName: ''}}
          onSubmit={(values, {setSubmitting}) => {
            const taskError = nameValidator(values.taskName);
            console.log(taskError);
            if (tasks == 0 && taskError) {
              setTaskName({...taskName, error: taskError});
              setSubmitting(false);
              return;
            }

            handleSave(values, setSubmitting);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <View style={styles.modalContainer}>
              <Header>Add a new Task</Header>
              <AntDesignIcon
                onPress={() => setModalVisible(false)}
                style={styles.icon}
                name="closecircle"
                size={24}
                color={BrandColor}
              />

              <Dropdown
                label={'Task'}
                inputs={tasksOptions}
                value={tasks}
                setValue={value => {
                  if (value != 0) {
                    setShowManual(false);
                    setTasks(value);
                  } else {
                    setTasks(value);
                    setShowManual(true);
                  }
                }}
              />

              {showManual && (
                <TextInput
                  label="Task Name"
                  icon="account"
                  value={values.taskName}
                  errorText={taskName.error}
                  onChangeText={handleChange('taskName')}
                  onBlur={handleBlur('taskName')}
                />
              )}

              <View style={{width: '80%'}}>
                <DatePicker
                  label={'Start Date'}
                  date={startDate}
                  setDate={setStartDate}
                />
              </View>

              <View style={{width: '80%'}}>
                <DatePicker
                  label={'End Date'}
                  date={endDate}
                  setDate={setEndDate}
                />
              </View>

              <Button
                text="Save"
                isLoading={isSubmitting}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </Modal>
    </Background>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  listContainer: {
    height: '80%',
  },
  contentContainerStyle: {
    height: '100%',
    paddingBottom: 100,
  },
  mainContainer: {
    backgroundColor: BrandColor,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    position: 'absolute',
    top: 0,
    padding: 5,
    width: '110%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    position: 'absolute',
    top: '35%',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  line: {
    width: '0.25%',
    height: 70,
    backgroundColor: GreyStroke,
  },
  text: {
    fontSize: 12,
    color: TextColor,
  },
  heading: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 100,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    justifyContent: 'space-around',
  },
  leftContainer: {
    width: '78%',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GreyStroke,
    padding: 5,
    flexDirection: 'row',
    elevation: 5,
  },
  rightContainer: {
    width: '18%',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GreenText,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    borderWidth: 2,
    borderColor: GreyStroke,
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
});
