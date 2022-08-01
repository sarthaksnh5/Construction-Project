import AsyncStorage from '@react-native-async-storage/async-storage';
import {projectId, userData} from '../constants/StorageHelpers';
import BackgroundTimer from 'react-native-background-timer';
import {hitLink} from '../constants/colors';
import PushNotification from 'react-native-push-notification';
import {PermissionsAndroid} from 'react-native';

export const storeData = async (username, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(username, jsonValue);
  } catch (e) {}
};

export const getData = async tagKey => {
  try {
    const value = await AsyncStorage.getItem(tagKey);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.warn(e);
  }
};

export const initialDate = date => {
  const newData = new Date(date);
  const finalDate =
    newData.getFullYear().toString() +
    '-' +
    (newData.getMonth() + 1).toString() +
    '-' +
    newData.getDate().toString();
  return finalDate;
};

export const getNotificationData = async () => {
  try {
    const resp = await getData(userData);
    if (resp != null) {
      const {id} = resp;
      const url = `${hitLink}/user/notification?user=${id}`;
      const response = await (await fetch(url, {method: 'GET'})).json();
      const {result, message} = response;
      if (result) {
        const {status, body} = message;
        if (status == 1) {
          PushNotification.localNotification({
            channelId: '1',
            title: 'BrickedIn',
            message: body,
          });
          const updateUrl = `${hitLink}/user/notification`;
          let fd = new FormData();
          fd.append('id', id);
          const updateResponse = await (
            await fetch(updateUrl, {
              method: 'PUT',
              body: fd,
            })
          ).json();
          const {result, message} = updateResponse;
          if (!result) {
            console.log(message);
          }
        }
      } else {
        console.log(message);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'Please give permission to use camera',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return 1;
    } else {
      alert('Please give camera Permissions');
      return 0;
    }
  } catch (err) {
    console.warn(err);
    return 0;
  }
};

export const logoutFunction = navigation => {
  AsyncStorage.clear();
  //   unregisterBackgroundFetchAsync();
  BackgroundTimer.stopBackgroundTimer();
  navigation.reset({
    index: 0,
    routes: [{name: 'Login'}],
  });
};

export const getProjectData = async setId => {
  getData(projectId).then(resp => {
    if (resp != null) {
      const {id} = resp;
      setId(id);
    }
  });
};

export const removeItemValue = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};
