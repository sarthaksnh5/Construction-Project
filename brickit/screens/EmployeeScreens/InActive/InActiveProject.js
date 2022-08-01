import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {useFocusEffect} from '@react-navigation/native';
import {
  BrandColor,
  hitLink,
  GreyStroke,
  TextColor,
} from '../../../constants/colors';
import {getData, storeData} from '../../../components/AsyncStorageHelpers';
import {userData, projectId} from '../../../constants/StorageHelpers';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import * as ProgressBar from 'react-native-progress';
import Dropdown from '../../../components/Dropdown';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import Header from '../../../components/Header';
import DatePicker from '../../../components/DatePicker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Formik} from 'formik';
import {nameValidator, emailValidator} from '../../../helpers/Validators';

const InActiveProject = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ownerName, setOwnerName] = useState({value: '', error: ''});
  const [ownerEmail, setOwnerEmail] = useState({value: '', error: ''});
  const [projectName, setProjectName] = useState({value: '', error: ''});
  const newData = new Date();
  const [startDate, setStartDate] = useState(
    newData.getFullYear().toString() +
      '-' +
      (newData.getMonth() + 1).toString() +
      '-' +
      newData.getDate().toString(),
  );
  const [endDate, setEndDate] = useState(
    newData.getFullYear().toString() +
      '-' +
      (newData.getMonth() + 1).toString() +
      '-' +
      newData.getDate().toString(),
  );
  const [location, setLocation] = useState({value: '', error: ''});
  const [projectLists, setProjectLists] = useState([]);
  const [userType, setUserType] = useState();

  const projectInput = [
    {label: 'Turn Key', value: 0},
    {label: 'Labour Rate', value: 1},
  ];
  const [projectType, setProjectType] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getProjects();
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  const getProjects = async () => {
    setProjectLists([]);

    await getData(userData).then(async resp => {
      if (resp != null) {
        const {id, type} = resp;
        setUserType(type);
        const url = `${hitLink}/project/?filter=projects&id=${id}`;
        // console.log(url);
        await fetch(url, {
          method: 'GET',
        })
          .then(resp => {
            resp
              .json()
              .then(response => {
                const {message, result} = response;
                if (result && message != 0) {
                  setLists(message);
                  message.map(item => {
                    if (item.status == 0) {
                      setProjectLists(projectLists => [item, ...projectLists]);
                    }
                  });
                  setIsLoading(false);
                } else {
                  setProjectLists([]);
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

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/`;

    let fd = new FormData();
    fd.append('name', values.project);
    fd.append('location', values.location);
    fd.append('startDate', startDate);
    fd.append('endDate', endDate);
    fd.append('types', projectType);
    fd.append('ownerName', values.ownerName);
    fd.append('ownerEmail', values.ownerEmail);

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {message, result} = response;
            console.log(message);
            if (result) {
              setShowModal(false);
              setSubmitting(false);
              setEndDate(new Date());
              setStartDate(new Date());
              getProjects();
            } else {
              alert('Unable to connect please try again later');
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

  const renderItem = ({
    item = {
      projectName: '',
      userName: '',
      projectComplete: 0,
      endDate: '',
      startDate: '',
      id: '',
    },
  }) => (
    <View style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            storeData(projectId, {id: item.id, name: item.projectName});
            navigation.navigate('Project');
          }}
          style={styles.upperContainer}>
          <FA5Icon name="images" size={45} color={BrandColor} />
          <View style={styles.textContainer}>
            <Text style={styles.projectName}>{item.projectName}</Text>
            <Text style={styles.ownerName}>{item.userName}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.line} />
        <View style={styles.downContainer}>
          <View style={styles.progressContainer}>
            <ProgressBar.Circle
              animated={true}
              color={BrandColor}
              progress={parseInt(item.projectComplete) / 100}
              thickness={2}
              showsText={true}
              strokeCap={'square'}
              formatText={text => {
                return item.projectComplete + '%';
              }}
              textStyle={{
                fontFamily: 'ReemKufi-Regular',
                fontSize: 14,
              }}
              size={45}
              borderColor={GreyStroke}
            />
          </View>
          <View style={styles.calendarContainer}>
            <FAIcon name="calendar" size={24} color={BrandColor} />
            <Text style={styles.startDate}>{item.startDate} </Text>
            <Text style={styles.space}>-</Text>
            <Text style={styles.endDate}>{item.endDate} </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProject', {id: item.id});
            }}
            disabled={userType == 0 || userType == 3 ? false : true}>
            <EntypoIcon
              name="dots-three-vertical"
              size={24}
              color={BrandColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Background barStyle="dark-content" bgColor="white">
      {projectLists.length > 0 ? (
        <FlatList
          data={projectLists}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: '90%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          style={{
            marginBottom: '18%',
          }}
        />
      ) : (
        <Text>No Project Found</Text>
      )}

      {userType == 0 || userType == 3 ? (
        <View style={styles.floatingButton}>
          <Button
            text="ADD New Project"
            onPress={() => {
              setShowModal(true);
            }}
          />
        </View>
      ) : null}

      <Modal
        animationType="slide"
        visible={showModal}
        transparent={true}
        onRequestClose={() => {
          setShowModal(false);
        }}>
        <Formik
          initialValues={{
            ownerName: '',
            ownerEmail: '',
            project: '',
            startDate: '',
            endDate: '',
            location: '',
          }}
          onSubmit={(values, {setSubmitting}) => {
            const nameError = nameValidator(values.project);
            const ownerError = nameValidator(values.ownerName);
            const emailError = emailValidator(values.ownerEmail);
            const locError = nameValidator(values.location);

            setProjectName({value: '', error: ''});
            if (nameError || ownerError || emailError) {
              setProjectName({...projectName, error: nameError});
              setOwnerName({...ownerName, error: ownerError});
              setOwnerEmail({...ownerEmail, error: emailError});
              setLocation({...location, error: locError});
              setSubmitting(false);
              return;
            }
            if (startDate.toString() === endDate.toString()) {
              setLocation({
                ...location,
                error: 'Start and End Date cannot be same',
              });
              setSubmitting(false);
              return;
            }
            handleSave(values, setSubmitting);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <View style={styles.modalContainer}>
              <ScrollView
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Header>Add a new Project</Header>

                <AntDesignIcon
                  onPress={() => setShowModal(false)}
                  style={styles.icon}
                  name="closecircle"
                  size={24}
                  color={BrandColor}
                />

                <TextInput
                  label="Owner Name"
                  icon="account"
                  value={values.ownerName}
                  errorText={ownerName.error}
                  onChangeText={handleChange('ownerName')}
                  onBlur={handleBlur('ownerName')}
                />

                <TextInput
                  label="Owner email"
                  icon="email"
                  value={values.ownerEmail}
                  errorText={ownerEmail.error}
                  description={'Password will be sent to this email id'}
                  onChangeText={handleChange('ownerEmail')}
                  onBlur={handleBlur('ownerEmail')}
                />

                <TextInput
                  label="Project Name"
                  icon="lightbulb"
                  value={values.project}
                  errorText={projectName.error}
                  onChangeText={handleChange('project')}
                  onBlur={handleBlur('project')}
                />

                <View style={styles.dateContainer}>
                  <View style={styles.date}>
                    <DatePicker
                      label={'Start Date'}
                      date={startDate}
                      value={startDate}
                      setDate={setStartDate}
                    />
                  </View>
                  <View style={styles.date}>
                    <DatePicker
                      label={'End Date'}
                      date={endDate}
                      value={endDate}
                      setDate={setEndDate}
                    />
                  </View>
                </View>

                <Dropdown
                  inputs={projectInput}
                  value={projectType}
                  setValue={setProjectType}
                />

                <TextInput
                  label="Location"
                  icon="map-marker"
                  value={values.location}
                  errorText={location.error}
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                />

                <Button
                  text="Save"
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </Modal>
    </Background>
  );
};

export default InActiveProject;

const styles = StyleSheet.create({
  container: {
    width: '92%',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: '2.5%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: GreyStroke,
    borderRadius: 15,
    elevation: 5,
  },
  upperContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 5,
  },
  textContainer: {
    marginHorizontal: 10,
  },
  projectName: {
    fontWeight: 'bold',
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 18,
    color: TextColor,
  },
  ownerName: {
    fontFamily: 'ReemKufi-Regular',
    fontSize: 18,
    color: TextColor,
  },
  line: {
    backgroundColor: GreyStroke,
    width: '100%',
    height: 2,
  },
  downContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: '2%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startDate: {
    fontSize: 15,
    color: TextColor,
    fontFamily: 'ReemKufi-Regular',
    marginLeft: 5,
  },
  endDate: {
    fontSize: 15,
    color: TextColor,
    fontFamily: 'ReemKufi-Regular',
  },
  space: {
    fontSize: 15,
    fontWeight: 'bold',
    color: TextColor,
    fontFamily: 'ReemKufi-SemiBold',
  },
  floatingButton: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    alignItems: 'center',
  },
  modalContainer: {
    // bottom: 0,
    // position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  dateContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  date: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
