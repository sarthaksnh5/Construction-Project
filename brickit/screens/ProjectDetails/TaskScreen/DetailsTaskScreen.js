import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  BrandColor,
  GreenText,
  GreyFill,
  GreyStroke,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  getData,
  requestCameraPermission,
} from '../../../components/AsyncStorageHelpers';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {Formik} from 'formik';
import {nameValidator} from '../../../helpers/Validators';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Background from '../../../components/Background';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import {TaskDetial} from '../../../constants/StorageHelpers';
import Header from '../../../components/Header';

const DetailsTaskScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString());
  const [endDate, setEndDate] = useState(new Date().toLocaleDateString());
  const [progress, setProgress] = useState({value: '0', error: ''});
  const [description, setDescription] = useState({value: '', error: ''});
  const [project, setProject] = useState();
  const [photos, setPhotos] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [testName, setTestName] = useState('');

  const getTaskData = async projid => {
    setIsLoading(true);
    const url = `${hitLink}/project/task?id=${projid}`;
    await fetch(url, {
      method: 'GET',
    })
      .then(async respon => {
        await respon
          .json()
          .then(async response => {
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

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/task`;

    let fd = new FormData();
    fd.append('description', values.description);
    fd.append('id', project);
    fd.append('progress', values.progress);
    fd.append('count', uploadedPhotos.length);
    let i = 0;
    for (let photo in uploadedPhotos) {
      fd.append(`photo${i}`, uploadedPhotos[i]);
      i = i + 1;
    }

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(resp => {
        resp.json().then(response => {
          const {result, message} = response;
          console.log(message);

          if (result) {
            setSubmitting(false);
            setUploadedPhotos(null);
            navigation.goBack();
          } else {
            alert('Server Error');
          }
        });
      })
      .catch(e => {
        console.log('Not posted');
        console.log(e);
        setDescription({...description, error: 'Server Error'});
        setSubmitting(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getData(TaskDetial).then(resp => {
        if (resp != null) {
          const {id, name} = resp;
          setTestName(name);
          setProject(id);
          navigation.setOptions({
            title: name,
          });
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

  const pickImages = async () => {
    try {
      const responseimg = await requestCameraPermission();
      if (responseimg === 1) {
        setUploadedPhotos([]);
        const response = await MultipleImagePicker.openPicker({
          maxSelectedAssets: 8,
          singleSelectedMode: false,
          selectedColor: BrandColor,
        });

        if (response.length > 0) {
          let i = 0;
          response.map(item => {
            const temp = {
              id: i,
              name: item.fileName,
              type: item.mime,
              uri: item.path,
            };
            i = i + 1;
            setUploadedPhotos(photo => [...photo, temp]);
          });
        } else {
          setUploadedPhotos([]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Background>
      <Header>{testName}</Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center',}}>
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
            <Text style={styles.text}>{description.value}</Text>
          </View>
        </View>
        <Formik
          initialValues={{
            progress: progress.value,
            description: description.value,
          }}
          onSubmit={(values, {setSubmitting}) => {
            const perror = nameValidator(values.progress);
            const derror = nameValidator(values.description);
            if (perror || derror) {
              setProgress({...progress, error: perror});
              setDescription({...description, error: derror});
              setSubmitting(false);
              return;
            }

            if (uploadedPhotos == null) {
              alert('Please upload photos');
              setSubmitting(false);
              return;
            }
            handleSave(values, setSubmitting);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <View style={styles.bottomContainer}>
              <TextInput
                label={'Progress'}
                icon="scale"
                value={values.progress}
                errorText={progress.error}
                onChangeText={handleChange('progress')}
                onBlur={handleBlur('progress')}
                keyboardType="numeric"
              />

              <TextInput
                label={'Description'}
                icon="calendar-text"
                value={values.description}
                errorText={description.error}
                onBlur={handleBlur('description')}
                onChangeText={handleChange('description')}
              />

              {uploadedPhotos != null ? (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={uploadedPhotos}
                  renderItem={renderImage}
                  keyExtractor={item => item.id}
                />
              ) : null}

              <Button
                text="Upload Photos"
                mode="outlined"
                onPress={pickImages}
              />

              <Button
                text="Save"
                isLoading={isSubmitting}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
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

export default DetailsTaskScreen;

const styles = StyleSheet.create({
  container: {
    width: '75%',
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
    color: TextColor,
  },
  text: {
    color: TextColor,
  },
  date: {
    color: TextColor,
  },
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
