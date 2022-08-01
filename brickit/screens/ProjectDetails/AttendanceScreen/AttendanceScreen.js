import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import {
  BrandColor,
  GreyStroke,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import {FlatList} from 'react-native-gesture-handler';
import Button from '../../../components/Button';
import Entypo from 'react-native-vector-icons/Entypo';
import Dropdown from '../../../components/Dropdown';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {Formik} from 'formik';
import {nameValidator} from '../../../helpers/Validators';
import TextInput from '../../../components/TextInput';
import {getData, initialDate} from '../../../components/AsyncStorageHelpers';
import {projectId} from '../../../constants/StorageHelpers';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from '../../../components/DatePicker';

const AttendanceScreen = ({navigation}) => {
  const [present, setPresent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [presentCount, setPresentCount] = useState(0);
  const [labours, setLabours] = useState([]);
  const [labourname, setLabourname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [addLabour, setAddLabour] = useState(false);
  const [fullname, setFullname] = useState({value: '', error: ''});
  const [age, setAge] = useState({value: '', error: ''});
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [hours, setHours] = useState({value: '', error: ''});
  const [todayDate, setTodayDate] = useState(initialDate(new Date()));

  const renderItem = ({item}) => (
    <View style={styles.container} key={item.id}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
      <View style={[styles.textContainer, {alignItems: 'center'}]}>
        <Text style={styles.text}>{item.hour}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Present</Text>
      </View>
    </View>
  );

  const getLabours = async () => {
    try {
      setIsLoading(true);
      const url = `${hitLink}/project/attendance?filter=labours`;
      const response = await (
        await fetch(url, {
          method: 'GET',
        })
      ).json();
      const {result, message} = response;
      if (result) {
        setLabours(message);
      } else {
        console.log(message);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const markPresent = () => {
    if (labourname != '' && hours.value != '') {
      if (present.length > 0) {
        let flag = 1;
        present.map(item => {
          if (item.name == labourname) {
            flag = 0;
          }
        });
        if (flag == 1) {
          const item = {
            id: presentCount,
            name: labourname,
            hour: hours.value,
          };
          setPresent(present => [item, ...present]);
          setShowModal(false);
          setLabourname('');
          setPresentCount(presentCount + 1);
        } else {
          setShowModal(false);
          setLabourname('');
        }
      } else {
        const item = {
          id: presentCount,
          name: labourname,
          hour: hours.value,
        };
        setPresent(present => [item, ...present]);
        setShowModal(false);
        setLabourname('');
        setPresentCount(presentCount + 1);
      }
      setHours({value: '', error: ''});
    } else {
      setHours({...hours, error: 'Please Fill all fields'});
    }
  };

  const getAttendance = async () => {
    setIsLoading(true);
    const projectData = await getData(projectId);
    if (projectData != null) {
      const {id} = projectData;
      const url = `${hitLink}/project/attendance?filter=date&project=${id}&date=${todayDate}`;

      try {
        const {result, message} = await (
          await fetch(url, {method: 'GET'})
        ).json();
        if (result) {
          if (message != '0') {
            setAttendanceMarked(true);
            setPresent(message.present);
            setIsLoading(false);
          } else {
            setAttendanceMarked(false);
            setPresent([]);
            setIsLoading(false);
          }
        } else {
          console.log(message);
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getAttendance();
  }, [todayDate]);

  useFocusEffect(
    React.useCallback(() => {
      setPresentCount(0);
      getAttendance();
      getLabours();
      return () => {
        setIsLoading(true);
        setTodayDate(initialDate(new Date()));
      };
    }, []),
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const markAttendance = async () => {
    setAttendanceLoading(true);
    const projectData = await getData(projectId);
    if (projectData != null) {
      const {id} = projectData;
      const url = `${hitLink}/project/attendance`;

      let fd = new FormData();
      fd.append('filter', 'mark');
      fd.append('project', id);
      fd.append('onDate', todayDate);
      fd.append('labourcount', present.length);
      let i = 0;
      present.map(item => {
        fd.append(`person_${i}`, item.name);
        fd.append(`hours_${i}`, item.hour);
        i = i + 1;
      });

      try {
        const {result, message} = await (
          await fetch(url, {
            method: 'POST',
            body: fd,
          })
        ).json();
        if (result) {
          setPresent([]);
          setAttendanceLoading(false);
          alert('Attendance marked');
          getAttendance();
        } else {
          console.log(message);
          setAttendanceLoading(false);
          alert('Server Error');
        }
      } catch (e) {
        setAttendanceLoading(false);
        console.log(e);
      }
    }
  };

  const handleSave = async (values, setSubmitting) => {
    const url = `${hitLink}/project/attendance`;

    let fd = new FormData();
    fd.append('filter', 'addlabour');
    fd.append('fullname', values.fullname);
    fd.append('age', values.age);

    try {
      const response = await (
        await fetch(url, {
          method: 'POST',
          body: fd,
        })
      ).json();
      const {result, message} = response;
      if (result) {
        setSubmitting(false);
        setAddLabour(false);
        getLabours();
      } else {
        console.log(message);
        setFullname({...fullname, error: 'Server error'});
        setSubmitting(false);
      }
    } catch (e) {
      console.log(e);
      setSubmitting(false);
    }
  };

  return (
    <Background>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerDiv}>
          <Header>Attendance</Header>
          {/* <Entypo
          name="download"
          color={BrandColor}
          size={24}
          onPress={() => {
            navigation.navigate('DownloadLabour');
          }}
        /> */}
        </View>
        <View style={styles.dateContainer}>
          <DatePicker label={'Date'} date={todayDate} setDate={setTodayDate} />
        </View>
        <View style={styles.innerContainer}>
          {present.length > 0 ? (
            <>
              {attendanceMarked ? (
                <Text style={styles.text}>Today Attendance Marked</Text>
              ) : (
                <Button
                  text={'Clear Attendance'}
                  onPress={() => setPresent([])}
                  mode="outlined"
                />
              )}
              {present.map(item => {
                return (
                  <View style={styles.container} key={item.id}>
                    <View style={styles.textContainer}>
                      <Text style={styles.text}>{item.name}</Text>
                    </View>
                    <View
                      style={[styles.textContainer, {alignItems: 'center'}]}>
                      <Text style={styles.text}>{item.hour}</Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.text}>Present</Text>
                    </View>
                  </View>
                );
              })}
            </>
          ) : (
            <Text style={styles.text}>No One Present Marked Yet</Text>
          )}
        </View>
        <View style={styles.floatingContainer}>
          {present.length > 0 && !attendanceMarked && (
            <View style={styles.saveButton}>
              <Button
                text={'Save'}
                isLoading={attendanceLoading}
                onPress={markAttendance}
              />
            </View>
          )}
          {present.length > 0 && attendanceMarked && (
            <View style={styles.updateButton}>
              <Button
                text={'Update'}
                onPress={() => {
                  navigation.navigate('EditAttendace', {
                    present: present,
                    date: todayDate,
                  });
                }}
              />
            </View>
          )}
          {!attendanceMarked && (
            <TouchableOpacity
              style={[styles.addButton]}
              onPress={() => setShowModal(true)}>
              <Entypo name="add-user" color={'white'} size={24} />
            </TouchableOpacity>
          )}
        </View>
        <Modal
          visible={showModal}
          animationType={'slide'}
          onRequestClose={() => {
            setShowModal(false);
          }}>
          {!addLabour ? (
            <View style={styles.modalContainer}>
              <Header>Mark Labour Present</Header>
              <Dropdown
                inputs={labours}
                value={labourname}
                setValue={setLabourname}
              />
              <TextInput
                label={'Hours'}
                icon="clock"
                value={hours.value}
                errorText={hours.error}
                onChangeText={text => setHours({error: '', value: text})}
                keyboardType="numeric"
              />
              <Button text={'Mark Present'} onPress={markPresent} />
              <Button
                text={'Add new labour'}
                mode={'outlined'}
                onPress={() => {
                  setAddLabour(true);
                }}
              />
            </View>
          ) : (
            <Formik
              initialValues={{
                fullname: '',
                age: '',
              }}
              onSubmit={(values, {setSubmitting}) => {
                const fullnameerror = nameValidator(values.fullname);
                const ageError = nameValidator(values.age);

                if (fullnameerror || ageError) {
                  setFullname({...fullname, error: fullnameerror});
                  setAge({...age, error: ageError});
                  setSubmitting(false);
                  return;
                }

                handleSave(values, setSubmitting);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                isSubmitting,
              }) => (
                <View style={styles.modalContainer}>
                  <Header>Add a new Labour</Header>

                  <TextInput
                    label={'Full Name'}
                    icon="account"
                    value={values.fullname}
                    errorText={fullname.error}
                    onChangeText={handleChange('fullname')}
                    onBlur={handleBlur('fullname')}
                  />

                  <TextInput
                    label={'Age'}
                    icon="scale"
                    value={values.age}
                    errorText={age.error}
                    onChangeText={handleChange('age')}
                    onBlur={handleBlur('age')}
                  />

                  <Button
                    text={'Save'}
                    isLoading={isSubmitting}
                    onPress={handleSubmit}
                  />

                  <Button
                    text={'Close'}
                    mode={'outlined'}
                    onPress={() => {
                      setAddLabour(false);
                    }}
                  />
                </View>
              )}
            </Formik>
          )}
        </Modal>
      </ScrollView>
    </Background>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 5,
    borderColor: GreyStroke,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 10,
  },
  text: {
    color: TextColor,
    fontFamily: 'ReemKufi-Regular',
    flexWrap: 'wrap',
  },
  textContainer: {
    width: '33%',
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    height: '70%',
  },
  floatingContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    borderRadius: 30,
    width: 50,
    height: 50,
    padding: 10,
    backgroundColor: BrandColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  dateContainer: {
    width: '100%',
  },
  headerDiv: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
