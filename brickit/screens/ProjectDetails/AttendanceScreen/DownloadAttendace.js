import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Paragraph from '../../../components/Paragraph';
import Dropdown from '../../../components/Dropdown';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {BrandColor, hitLink} from '../../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from '../../../components/DatePicker';
import {getData, initialDate} from '../../../components/AsyncStorageHelpers';
import Button from '../../../components/Button';
import {projectId} from '../../../constants/StorageHelpers';
import * as ProgressBar from 'react-native-progress';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const DownloadAttendace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const filter = [
    {label: 'Date', value: 'date'},
    {label: 'User', value: 'user'},
  ];
  const [filterOption, setFilterOption] = useState('date');
  const [labours, setLabours] = useState([]);
  const [date, setDate] = useState(initialDate(new Date()));
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

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

  const downloadAttendace = async () => {
    const resp = await getData(projectId);
    var url = '';
    if (resp != null) {
      if (filterOption == 'user') {
        url = `${hitLink}/project/labours.csv?filter=${filterOption}&project=${resp.id}&user=${selectedUser}`;
      }
      if (filterOption == 'date') {
        url = `${hitLink}/project/labours.csv?filter=${filterOption}&project=${resp.id}&date=${date}`;
      }

      downloadFile(url);
    }
  };

  const downloadFile = url => {
    setDownloadProgress(0);
    const name = 'labours.csv';
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
        } else {
          console.log('error');
        }
        setShowModal(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const showProgress = pro => {
    const progressCount = parseInt(
      (parseInt(pro.bytesWritten) / parseInt(pro.contentLength)) * 100,
    );
    setDownloadProgress(progressCount);
  };

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <Header>Download Attendace</Header>
      <Paragraph>Select by user or date</Paragraph>
      <Dropdown
        value={filterOption}
        setValue={setFilterOption}
        inputs={filter}
      />
      {filterOption == 'date' && (
        <View style={styles.innerContainer}>
          <DatePicker date={date} setDate={setDate} />
          <Button text={'Download'} onPress={downloadAttendace} />
        </View>
      )}
      {filterOption == 'user' && (
        <View style={styles.innerContainer}>
          <Dropdown
            inputs={labours}
            value={selectedUser}
            setValue={setSelectedUser}
          />
          <Button text={'Download'} onPress={downloadAttendace} />
        </View>
      )}
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

export default DownloadAttendace;

const styles = StyleSheet.create({
  innerContainer: {
    width: '80%',
    alignItems: 'center',
  },
});
