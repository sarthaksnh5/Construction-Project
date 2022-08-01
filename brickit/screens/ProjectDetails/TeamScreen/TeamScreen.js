import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getData} from '../../../components/AsyncStorageHelpers';
import {projectId, userData} from '../../../constants/StorageHelpers';
import {
  BrandColor,
  GreyStroke,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import FullScreenLoading from '../../../components/FullScreenLoading';
import Background from '../../../components/Background';
import Button from '../../../components/Button';
import {Formik} from 'formik';
import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const TeamScreen = ({navigation}) => {
  const inputs = [
    {label: 'Project Manager', value: 3},
    {label: 'Supervisor', value: 2},
    {label: 'Inventory', value: 4},
    {label: 'Contractor', value: 5},
  ];

  const [usersList, setUsersList] = useState();
  const [selectedUser, setselectedUser] = useState(null);
  const [showUserOption, setShowUserOption] = useState(false);
  const [userType, setUserType] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [positionType, setPositionType] = useState(3);
  const [isLoadign, setIsLoadign] = useState(true);

  const [users, setUsers] = useState([]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(`tel:${item.mobile}`);
      }}
      style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.mobile}>{item.mobile}</Text>
      </View>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownText}>{item.position}</Text>
      </View>
    </TouchableOpacity>
  );

  const getTeams = async () => {
    setIsLoadign(true);
    await getData(projectId).then(async resp => {
      if (resp != null) {
        const url = `${hitLink}/project/team?id=${resp.id}`;
        fetch(url, {
          method: 'GET',
        })
          .then(respon => {
            respon
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  if (message.length > 0) {
                    setUsers(message);
                  } else {
                    setUsers([]);
                  }
                  setIsLoadign(false);
                } else {
                  alert('Server Error');
                  setIsLoadign(false);
                }
              })
              .catch(e => {
                console.log(e);
                setIsLoadign(false);
              });
          })
          .catch(e => {
            console.log(e);
            setIsLoadign(false);
          });
      }
    });
  };

  const getUsers = () => {
    const url = `${hitLink}/user/user?filter=1&type=${positionType}`;
    fetch(url, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              setUsersList(message);
              setShowUserOption(true);
            } else {
              setShowUserOption(false);
              console.log(message);
            }
          })
          .catch(e => {
            console.log(e);
            setShowUserOption(false);
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
        setShowUserOption(false);
        console.log(e);
      });
  };

  const handleSave = setSubmitting => {
    const url = `${hitLink}/project/team`;
    getData(projectId).then(resp => {
      if (resp != null) {
        let fd = new FormData();

        fd.append('project', resp.id);
        fd.append('type', positionType);
        fd.append('user', selectedUser);

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
                  setSubmitting(false);
                  setModalVisible(false);
                  getTeams();
                } else {
                  setSubmitting(false);
                  alert('Server error please try again');
                  console.log(message);
                }
                setSubmitting(false);
              })
              .catch(e => {
                setSubmitting(false);
                console.log(e);
              });
          })
          .catch(e => {
            setSubmitting(false);
            console.log(e);
          });
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
      getTeams();
      return () => {
        setIsLoadign(true);
      };
    }, []),
  );

  useEffect(() => {
    getUsers();
    getTeams();
  }, [positionType]);

  const getUserData = async () => {
    await getData(userData).then(async resp => {
      if (resp != null) {
        const {id, type} = resp;
        await setUserType(type);
      }
    });
  };

  if (isLoadign) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.mainContainer}>
        {users.length > 0 ? (
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text>No Team Members Found</Text>
        )}
      </View>
      {userType == 0 || userType == 3 ? (
        <View style={styles.bottomContainer}>
          <Button
            text="ADD a New Member"
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
      ) : null}
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Formik
          initialValues={{mobile: '', personName: '', positionType: ''}}
          onSubmit={(values, {setSubmitting}) => {
            if (selectedUser == null) {
              alert('Please select user');
              setSubmitting(false);
            } else {
              handleSave(setSubmitting);
            }
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <View style={styles.modalContainer}>
              <Header>Add a new Member</Header>
              <AntDesignIcon
                onPress={() => setModalVisible(false)}
                style={styles.icon}
                name="closecircle"
                size={24}
                color={BrandColor}
              />

              <Dropdown
                label={'Position Type'}
                inputs={inputs}
                value={positionType}
                setValue={setPositionType}
              />

              {showUserOption && (
                <Dropdown
                  label={'Person Name'}
                  inputs={usersList}
                  value={selectedUser}
                  setValue={setselectedUser}
                />
              )}

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

export default TeamScreen;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    padding: 5,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    elevation: 5,
    borderWidth: 1,
    borderColor: GreyStroke,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  textContainer: {
    padding: 10,
    width: '60%',
  },
  username: {
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    fontSize: 18,
    flexWrap: 'wrap',
  },
  dropdownText: {
    fontFamily: 'ReemKufi-Regular',
    color: BrandColor,
    fontSize: 15,
  },
  mobile: {
    fontFamily: 'ReemKufi-Regular',
    color: TextColor,
    fontSize: 15,
  },
  dropdownContainer: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
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
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
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
