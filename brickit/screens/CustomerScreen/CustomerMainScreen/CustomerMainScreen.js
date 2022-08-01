import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {
  BrandColor,
  GreenText,
  GreyStroke,
  hitLink,
  lightBrand,
  TextColor,
} from '../../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import {getData, storeData} from '../../../components/AsyncStorageHelpers';
import {projectId, userData} from '../../../constants/StorageHelpers';
import FullScreenLoading from '../../../components/FullScreenLoading';
import Background from '../../../components/Background';
import SemiCircleProgress from '../../../components/SemiCircular';
import Button from '../../../components/Button';
import CustomSlider from '../../../components/CustomSlider';
import Header from '../../../components/Header';

const CustomerMainScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalDays, setTotalDays] = useState();
  const [currentDays, setCurrentDays] = useState();
  const [tasks, setTasks] = useState();
  const [allTask, setAllTask] = useState([]);
  const [completeTask, setCompleteTask] = useState();
  const [progress, setProgress] = useState(0);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [photos, setPhotos] = useState();
  const [userProjectId, setUserProjectId] = useState();
  const [showModal, setShowModal] = useState(false);
  const [teamLoading, setTeamLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [raiseQueryModel, setRaiseQueryModel] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const renderItem = ({item}) => (
    <View style={styles.personContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.mobile}>{item.mobile}</Text>
      </View>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownText}>{item.position}</Text>
      </View>
    </View>
  );

  const raiseQuery = async () => {
    if(name.length > 0 && email.length > 0 && message.length > 0){
      let fd = new FormData()
      fd.append('name', name)
      fd.append('email', email)
      fd.append('message', message)

      const response = await fetch(url)
    }else{
      alert('Please Fill all fields')
    }
  }

  const getProjectData = async id => {
    setIsLoading(true);
    const url = `${hitLink}/project/?filter=customer&id=${id}`;

    await fetch(url, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {message} = response;
            storeData(projectId, {id: message.id});
            setUserProjectId(message.id);
            setTotalDays(message.total);
            setAllTask(message.tasks);
            setCurrentDays(message.date);
            setTasks(message.task);
            setCompleteTask(message.completedTask);
            setStart(message.start);
            setEnd(message.end);
            setProgress(message.progress);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });

    let url2 = `${hitLink}/project/photo?id=${id}`;    

    await fetch(url2, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              // console.log(message);
              setPhotos(message);
              setIsLoading(false);
            } else {
              setPhotos([]);
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
  };

  const getTeam = async () => {
    setTeamLoading(true);
    setShowModal(true);

    const url = `${hitLink}/project/team?id=${userProjectId}`;
    await fetch(url, {
      method: 'GET',
    }).then(respon => {
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
            setTeamLoading(false);
          } else {
            console.log(response);
            alert('Server Error');
            setTeamLoading(false);
          }
        })
        .catch(e => {
          console.log(e);
          setTeamLoading(false);
        });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getData(userData).then(resp => {
        getProjectData(resp.id);
      });
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.card}>
          <View>
            <Text style={styles.heading}></Text>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.text}>
              Day: {currentDays}/{totalDays}
            </Text>
            <Text style={styles.text}>
              Task: {completeTask}/{tasks}
            </Text>
          </View>
          <View style={styles.circular}>
            <SemiCircleProgress
              percentage={progress}
              progressShadowColor={lightBrand}
              progressColor={BrandColor}>
              <Text style={{fontSize: 32, color: BrandColor}}>{progress}%</Text>
            </SemiCircleProgress>
          </View>
          <View style={styles.progressDates}>
            <Text style={styles.dateText}>{start}</Text>
            <Text style={styles.dateText}>{end}</Text>
          </View>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('customerTask')}
            style={styles.mainButtonContainer}>
            <View style={styles.buttonContainer}>
              <Image
                source={require('../../../assets/figma/project.png')}
                style={styles.buttonImage}
              />
            </View>
            <Text style={styles.buttonText}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Documents')}
            style={styles.mainButtonContainer}>
            <View style={styles.buttonContainer}>
              <Image
                source={require('../../../assets/figma/detail.jpg')}
                style={styles.buttonImage}
              />
            </View>
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionContainer}>
          <View style={styles.mainButtonContainer}>
            <View style={styles.buttonContainer}>
              <Image
                source={require('../../../assets/figma/timeline.png')}
                style={styles.buttonImage}
              />
            </View>
            <Text style={styles.buttonText}>Timeline</Text>
          </View>
          <TouchableOpacity
            onPress={getTeam}
            style={styles.mainButtonContainer}>
            <View style={styles.buttonContainer}>
              <Image
                source={require('../../../assets/figma/team.png')}
                style={styles.buttonImage}
              />
            </View>
            <Text style={styles.buttonText}>Team</Text>
          </TouchableOpacity>
        </View>
        <View>
          <CustomSlider data={photos} />
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Button text={'Raise a Query'} />
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide">
        <View style={styles.teamContainer}>
          <View style={styles.innerTeamContainer}>
            <Header>Teams</Header>
            {teamLoading ? (
              <ActivityIndicator size={'large'} color={BrandColor} />
            ) : (
              <>
                {users.length > 0 ? (
                  <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <Text>No Team Members Found</Text>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
      
    </Background>
  );
};

export default CustomerMainScreen;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 15,
    padding: 10,
    marginVertical: 15,
    borderWidth: 0.5,
    borderColor: GreyStroke,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: 'lightblue',
    marginBottom: Platform.select({ios: 0, android: 1}),
  },
  heading: {
    fontSize: 25,
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
  },
  innerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 22,
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
  },
  circular: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  progressDates: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateText: {
    color: BrandColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  imageView: {
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginRight: 5,
  },
  bigImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignItems: 'flex-end',
  },
  container: {
    width: '100%',
    marginBottom: 10,
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
  taskText: {
    fontFamily: 'ReemKufi-Regular',
    fontSize: 12,
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
  optionContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  mainButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 75,
    height: 80,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  innerTeamContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  personContainer: {
    width: '98%',
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
    width: '50%',
  },
  username: {
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    fontSize: 18,
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
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
