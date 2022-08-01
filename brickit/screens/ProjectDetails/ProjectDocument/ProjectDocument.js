import {StyleSheet, Text, View, FlatList, Modal} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';
import {
  BrandColor,
  GreyStroke,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import {getData} from '../../../components/AsyncStorageHelpers';
import {projectId, userData} from '../../../constants/StorageHelpers';
import FullScreenLoading from '../../../components/FullScreenLoading';
import Button from '../../../components/Button';
import RNFS from 'react-native-fs';
import * as ProgressBar from 'react-native-progress';
import FileViewer from 'react-native-file-viewer';

const ProjectDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const getDocuments = async () => {
    await getData(projectId).then(resp => {
      if (resp != null) {
        const url = `${hitLink}/project/document?id=${resp.id}`;

        fetch(url, {
          method: 'GET',
        })
          .then(respon => {
            respon
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  setDocuments(message);
                  setIsLoading(false);
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

  const RenderDocuments = ({item}) => (
    <View key={item.id} style={styles.innerContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.file}</Text>
        <Text style={styles.subtitle}>{item.date}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            downloadFile(item.url);
          }}
          text={'Download'}
          mode={'outlined'}
        />
      </View>
    </View>
  );

  useEffect(() => {
    getDocuments();
    return () => {
      setIsLoading(true);
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.card}>
        <View>
          <Text style={styles.heading}>Building Documents</Text>
        </View>
        <View style={{width: '100%'}}>
          {documents.length > 0 ? (
            <FlatList
              data={documents}
              style={{width: '100%'}}
              renderItem={RenderDocuments}
              keyExtractor={item => item.id}
            />
          ) : null}
        </View>
      </View>
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

export default ProjectDocument;

const styles = StyleSheet.create({
  card: {
    width: '95%',
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 15,
    padding: 5,
    marginVertical: 15,
    borderWidth: 0.5,
    borderColor: GreyStroke,
  },
  heading: {
    fontSize: 25,
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
  },
  innerContainer: {
    padding: 5,
    marginBottom: 20,
    flexDirection: 'row',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: GreyStroke,
  },
  textContainer: {
    padding: 5,
    width: '40%',
  },
  buttonContainer: {
    width: '60%',
    marginLeft: '10%',
  },
  title: {
    fontSize: 20,
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    flexWrap: 'wrap',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'ReemKufi-Regular',
    color: TextColor,
    flexWrap: 'wrap',
  },
});
