/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';

PushNotification.createChannel({
  channelId: '1',
  channelName: 'BrickedIn',
});

AppRegistry.registerComponent(appName, () => App);
