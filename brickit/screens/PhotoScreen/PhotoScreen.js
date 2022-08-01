import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';

const PhotoScreen = ({navigation, route}) => {
  const {imageUrl} = route.params;
  console.log(imageUrl);

  return (
    <View style={styles.container}>
      <ImageViewer imageUrls={imageUrl} />
    </View>
  );
};

export default PhotoScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
