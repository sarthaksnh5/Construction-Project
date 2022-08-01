import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import {BrandColor} from '../constants/colors';

const Background = ({
  children,
  barStyle = 'light-content',
  bgColor = BrandColor,
}) => {
  return (
    <ImageBackground
      source={require('../assets/figma/background.png')}
      resizeMode="cover"
      style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => 2,
        })()}>
        <StatusBar barStyle={barStyle} backgroundColor={bgColor} />
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Background;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    height: '100%',
    width: '100%',
  },
});
