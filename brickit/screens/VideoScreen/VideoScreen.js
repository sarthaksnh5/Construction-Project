import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Background from '../../components/Background';
import Video from 'react-native-video';
import FullScreenLoading from '../../components/FullScreenLoading';

const VideoScreen = ({navigation, route}) => {
  const {url} = route.params;
  return (
    <Background>
      <Video
        style={styles.video}
        onBuffer={FullScreenLoading}
        source={{uri: url}}
        controls={true}
        resizeMode={'contain'}
      />
    </Background>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});
