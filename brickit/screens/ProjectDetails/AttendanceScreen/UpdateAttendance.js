import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Paragraph from '../../../components/Paragraph';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  BrandColor,
  GreyStroke,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {useFocusEffect} from '@react-navigation/native';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import Dropdown from '../../../components/Dropdown';
import {Formik} from 'formik';
import {nameValidator} from '../../../helpers/Validators';
import {getData} from '../../../components/AsyncStorageHelpers';
import {projectId} from '../../../constants/StorageHelpers';

const UpdateAttendance = ({navigation, route}) => {
  const {present, date} = route.params;
  const [presentPeople, setPresentPeople] = useState(present);
  const [isLoading, setIsLoading] = useState(false);
  const [labours, setLabours] = useState([]);
  const [attendaceLoading, setAttendaceLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullname, setFullname] = useState({value: '', error: ''});
  const [age, setAge] = useState({value: '', error: ''});
  const [hours, setHours] = useState({value: '', error: ''});
  const [labourname, setLabourname] = useState('');
  const [addLabour, setAddLabour] = useState(false);

  const deleteItem = id => {
    const temp = presentPeople;
    setPresentPeople([]);
    temp.map(item => {
      if (item.id != id) {
        setPresentPeople(presentPeople => [item, ...presentPeople]);
      }
    });
  };

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

  useFocusEffect(
    React.useCallback(() => {
      getLabours();
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  const markPresent = () => {
    if (labourname != '' && hours.value != '') {
      if (present.length > 0) {
        let flag = 1;
        present.map(item => {
          if (item.name === labourname) {
            flag = 0;
          }
        });
        if (flag == 1) {
          const item = {
            id: presentPeople.length,
            name: labourname,
            hour: hours.value,
          };
          setPresentPeople(presentPeople => [item, ...presentPeople]);
          setShowModal(false);
          setLabourname('');
        } else {
          setShowModal(false);
          setLabourname('');
        }
      } else {
        const item = {
          id: presentPeople.length,
          name: labourname,
          hour: hours.value,
        };
        setPresentPeople(presentPeople => [item, ...presentPeople]);
        setShowModal(false);
        setLabourname('');
      }
      setHours({value: '', error: ''});
    } else {
      setHours({...hours, error: 'Please Fill all fields'});
    }
  };

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const markAttendance = async () => {
    const projectData = await getData(projectId);
    if (projectData != null) {
      const {id} = projectData;
      const url = `${hitLink}/project/attendance`;

      let fd = new FormData();
      fd.append('filter', 'updateAttendance');
      fd.append('project', id);
      fd.append('onDate', date);
      fd.append('labourcount', presentPeople.length);
      let i = 0;
      presentPeople.map(item => {
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
          alert('Attendance marked');
          navigation.navigate('Attendance1');
        } else {
          console.log(message);
          setAttendaceLoading(false);
          alert('Server Error');
        }
      } catch (e) {
        setAttendaceLoading(false);
        console.log(e);
      }
    }
  };

  return (
    <Background>
      <ScrollView>
        <Header>Update Attendance</Header>
        <Paragraph>{date}</Paragraph>
        <View style={styles.listContainer}>
          {presentPeople.map(item => {
            return (
              <View style={styles.container} key={item.id}>
                <View style={styles.dataContainer}>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text style={styles.text}>{item.hour}</Text>
                  <Text style={styles.text}>Present</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem(item.id)}>
                  <AntDesign name="delete" color={BrandColor} size={24} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={styles.floatingContainer}>
          <View style={styles.saveButton}>
            <Button
              text={'Save'}
              isLoading={attendaceLoading}
              onPress={markAttendance}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.addButton,
              present.length > 0 ? styles.width20 : styles.width40,
            ]}
            onPress={() => setShowModal(true)}>
            <Entypo name="add-user" color={'white'} size={24} />
          </TouchableOpacity>
        </View>
        <Modal
          visible={showModal}
          animationType={'slide'}
          onRequestClose={() => {
            setShowModal(false);
          }}>
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
          </View>
        </Modal>
      </ScrollView>
    </Background>
  );
};

export default UpdateAttendance;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
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
  },
  listContainer: {
    width: '80%',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center',
  },
  dataContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    marginLeft: 20,
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
  addButton: {
    width: '18%',
    borderRadius: 25,
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
});
