/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Text, View, Image, ScrollView, Modal} from 'react-native';
import React, {useState, useEffect} from 'react';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {BrandColor, hitLink} from '../../../constants/colors';
import Background from '../../../components/Background';
import {Formik} from 'formik';
import {emailValidator, nameValidator} from '../../../helpers/Validators';
import Header from '../../../components/Header';
import TextInput from '../../../components/TextInput';
import DatePicker from '../../../components/DatePicker';
import Button from '../../../components/Button';
import SnackbarHelper from '../../../components/SnackbarHelper';
import {useFocusEffect} from '@react-navigation/native';
import {Paragraph} from 'react-native-paper';
import * as ProgressBar from 'react-native-progress';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const EditProjectScreen = ({navigation, route}) => {
  const [ownerName, setOwnerName] = useState({value: '', error: ''});
  const [ownerEmail, setOwnerEmail] = useState({value: '', error: ''});
  const [projectName, setProjectName] = useState({value: '', error: ''});
  const [startDate, setStartDate] = useState(new Date().toDateString());
  const [endDate, setEndDate] = useState(new Date().toDateString());
  const [location, setLocation] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(true);
  const [showSnack, setShowSnack] = useState(false);
  const [snackData, setSnackData] = useState('');
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const projectId = route.params.id;

  const showProgress = pro => {
    const progressCount = parseInt(
      (parseInt(pro.bytesWritten) / parseInt(pro.contentLength)) * 100,
    );
    setDownloadProgress(progressCount);
  };

  const downloadFile = url => {
    setDownloadProgress(0);
    const nameArr = url.split('/');
    const name = nameArr[nameArr.length - 1];
    const directory = RNFS.DocumentDirectoryPath + '/' + name;

    RNFS.downloadFile({
      fromUrl: url,
      toFile: directory,
      begin: setShowModal(true),
      progress: progres => showProgress(progres),
    })
      .promise.then(response => {
        if (response.statusCode == 200) {
          FileViewer.open(directory);
        }
        setShowModal(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getProjectDetails = async () => {
    const url = `${hitLink}/project/?filter=single&id=${projectId}`;

    await fetch(url, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              setOwnerEmail({value: message.email, error: ''});
              setDocuments(message.docs);
              setOwnerName({value: message.owner, error: ''});
              setProjectName({value: message.name, error: ''});
              setStartDate(message.startDate);
              setEndDate(message.endDate);
              setLocation({value: message.location, error: ''});
              setIsLoading(false);
            } else {
              alert('Server error! Please try again later');
              console.log(message);
              navigation.goBack();
            }
          })
          .catch(e => {
            console.log(e);
            navigation.goBack();
          });
      })
      .catch(e => {
        console.log(e);
        navigation.goBack();
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getProjectDetails();
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  const RenderDocuments = documents.map(item => {
    return (
      <View
        key={item.id}
        style={{
          flexDirection: 'row',
          width: '80%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={styles.textContainer}>
          <Text style={{flexWrap: 'wrap'}}>{item.name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={{flexWrap: 'wrap'}}>{item.date}</Text>
        </View>
        <View style={{width: '33%'}}>
          <Button
            onPress={() => {
              downloadFile(item.document);
            }}
            text={'View'}
            mode={'outlined'}
          />
        </View>
      </View>
    );
  });

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/`;

    let fd = new FormData();
    fd.append('id', projectId);
    fd.append('name', values.project);
    fd.append('location', values.location);
    fd.append('startDate', startDate);
    fd.append('endDate', endDate);
    fd.append('owner', values.owner);
    fd.append('email', values.ownerEmail);

    fetch(url, {
      method: 'PUT',
      body: fd,
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {message, result} = response;
            if (result) {
              setShowSnack(true);
              setSnackData('Project Updated');
              setTimeout(() => {
                navigation.goBack();
              }, 3000);
            } else {
              alert('Server error! Please try again later');
              console.log(message);
            }
            setSubmitting(false);
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

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/figma/image2.jpg')}
          style={styles.image}
        />
        <View style={styles.bottomContainer}>
          <Text style={styles.projectName}>{projectName.value}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{startDate} </Text>
            <Text style={styles.date}> - </Text>
            <Text style={styles.date}>{endDate}</Text>
          </View>
        </View>
      </View>
      <Formik
        initialValues={{
          owner: ownerName.value,
          project: projectName.value,
          startDate: startDate,
          endDate: endDate,
          ownerEmail: ownerEmail.value,
          location: location.value,
        }}
        onSubmit={(values, {setSubmitting}) => {
          const ownerError = nameValidator(values.owner);
          const projectError = nameValidator(values.project);
          const emailError = emailValidator(values.ownerEmail);
          const locationError = nameValidator(values.location);
          if (ownerError || projectError || emailError || locationError) {
            setOwnerEmail({...ownerEmail, error: emailError});
            setOwnerName({...ownerName, error: ownerError});
            setProjectName({...projectName, error: projectError});
            setLocation({...location, error: locationError});
            setSubmitting(false);
            return;
          }

          handleSave(values, setSubmitting);
        }}>
        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Header>Project</Header>
              <Paragraph>Documents</Paragraph>
              {documents.length > 0 && RenderDocuments}
              <Button
                text={'Upload Documents'}
                mode={'outlined'}
                onPress={() => {
                  navigation.navigate('UploadScreen', {
                    project: route.params.id,
                  });
                }}
              />

              <TextInput
                label="Owner Name"
                icon="account"
                placeholder="Owner Name"
                value={values.owner}
                errorText={ownerName.error}
                onChangeText={handleChange('owner')}
                onBlur={handleBlur('owner')}
              />

              <TextInput
                label="Email Address"
                icon="email"
                value={values.ownerEmail}
                errorText={ownerEmail.error}
                onChangeText={handleChange('ownerEmail')}
                onBlur={handleBlur('ownerEmail')}
                keyboardType="email-address"
              />

              <TextInput
                label="Project Name"
                icon="lightbulb"
                placeholder="Project Name"
                value={values.project}
                errorText={projectName.error}
                onChangeText={handleChange('project')}
                onBlur={handleBlur('project')}
              />

              <View style={styles.formDateContainer}>
                <View style={styles.formDate}>
                  <DatePicker
                    label={'Start Date'}
                    date={startDate}
                    setDate={setStartDate}
                  />
                </View>
                <View style={styles.formDate}>
                  <DatePicker
                    label={'End Date'}
                    date={endDate}
                    setDate={setEndDate}
                  />
                </View>
              </View>

              <TextInput
                label="Location"
                icon="map-marker"
                placeholder="Location"
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
            </View>
          </ScrollView>
        )}
      </Formik>
      <SnackbarHelper
        content={snackData}
        showSnack={showSnack}
        setShowSnack={setShowSnack}
      />
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '50%',
              height: '20%',
              backgroundColor: 'white',
              borderRadius: 25,
              elevation: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ProgressBar.Pie
              progress={downloadProgress}
              size={65}
              color={BrandColor}
            />
          </View>
        </View>
      </Modal>
    </Background>
  );
};

export default EditProjectScreen;

const styles = StyleSheet.create({
  imageContainer: {
    width: '120%',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
    width: '100%',
  },
  projectName: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 25,
    color: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  date: {
    fontFamily: 'ReemKufi-Regular',
    color: 'white',
    fontSize: 18,
  },
  formDateContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  formDate: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '33%',
  },
});
