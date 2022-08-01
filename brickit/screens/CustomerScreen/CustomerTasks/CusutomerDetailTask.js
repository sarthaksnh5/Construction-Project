import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  GreenText,
  GreyFill,
  GreyStroke,
  hitLink,
} from '../../../constants/colors';
import FullScreenLoading from '../../../components/FullScreenLoading';
import Background from '../../../components/Background';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useFocusEffect} from '@react-navigation/native';
import {getData} from '../../../components/AsyncStorageHelpers';
import {TaskDetial} from '../../../constants/StorageHelpers';

const CusutomerDetailTask = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString());
  const [endDate, setEndDate] = useState(new Date().toLocaleDateString());
  const [progress, setProgress] = useState({value: '0', error: ''});
  const [description, setDescription] = useState({value: '', error: ''});
  const [project, setProject] = useState();
  const [photos, setPhotos] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getTaskData = async id => {
    setIsLoading(true);
    const url = `${hitLink}/project/task?id=${id}`;
    fetch(url, {
      method: 'GET',
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              const {
                startDate,
                endDate,
                progressValue,
                descriptionValue,
                photosArray,
              } = message;
              setStartDate(startDate);
              setEndDate(endDate);
              setProgress({value: progressValue, error: ''});
              setDescription({value: descriptionValue, error: ''});
              setPhotos(photosArray);
              setIsLoading(false);
            } else {
              console.log(message);
              navigation.goBack();
            }
          })
          .catch(e => {
            console.log(e);
            setIsLoading(false);
            navigation.goBack();
          });
      })
      .catch(e => {
        console.log(e);
        setIsLoading(false);
        navigation.goBack();
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getData(TaskDetial).then(resp => {
        if (resp != null) {
          const {id} = resp;
          setProject(id);
          getTaskData(id);
        }
      });
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const renderImage = ({item}) => (
    <TouchableOpacity onPress={() => setShowModal(true)}>
      <Image
        progressiveRenderingEnabled={true}
        source={{uri: item.uri}}
        key={item.id}
        style={styles.image}
      />
    </TouchableOpacity>
  );

  return (
    <Background>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
              <Text style={styles.bold}>Start: </Text>
              <Text style={styles.date}>{startDate}</Text>
            </View>
            <View style={styles.topContainer}>
              <Text style={styles.bold}>End: </Text>
              <Text style={styles.date}>{endDate}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressValue,
                {width: `${progress.value}%`},
              ]}></View>
          </View>
          <View style={styles.progress}>
            <Text style={styles.bold}>Progress: </Text>
            <Text style={styles.progressText}>{progress.value}%</Text>
          </View>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={photos}
            renderItem={renderImage}
            keyExtractor={item => item.id}
          />
          <View style={{width: '100%'}}>
            <Text style={styles.bold}>Description</Text>
            <Text>{description.value}</Text>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        onRequestClose={() => {
          setShowModal(false);
        }}
        visible={showModal}>
        <ImageViewer imageUrls={photos} />
      </Modal>
    </Background>
  );
};

export default CusutomerDetailTask;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderColor: GreyStroke,
    elevation: 5,
    borderWidth: 2,
    borderRadius: 15,
    padding: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    width: '80%',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 20,
    marginRight: 5,
  },
  progress: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  progressText: {
    color: GreenText,
  },
  progressContainer: {
    width: '100%',
    height: 20,
    borderRadius: 20,
    backgroundColor: GreyFill,
    marginBottom: 5,
  },
  progressValue: {
    height: 20,
    borderRadius: 20,
    backgroundColor: GreenText,
  },
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  topContainer: {
    flexDirection: 'row',
  },
  bold: {
    fontWeight: 'bold',
  },
  date: {},
  bottomContainer: {
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 15,
    width: '82%',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
