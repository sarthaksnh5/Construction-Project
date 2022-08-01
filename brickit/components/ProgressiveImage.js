import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {BrandColor} from '../constants/colors';

const ProgressiveImage = ({containerStyle, ...props}) => {
  const [isLoading, setisLoading] = useState(false);
  return (
    <View style={containerStyle}>
      <Image
        {...props}
        onLoadStart={() => setisLoading(true)}
        onLoadEnd={() => setisLoading(false)}
      />
      {isLoading && (
        <ActivityIndicator
          style={{alignSelf: 'center'}}
          size={'small'}
          color={BrandColor}
        />
      )}
    </View>
  );
};

export default ProgressiveImage;

const styles = StyleSheet.create({});
