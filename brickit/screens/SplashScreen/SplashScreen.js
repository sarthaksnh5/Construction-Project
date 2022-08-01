import {StyleSheet, StatusBar, View, Image, Text} from 'react-native';
import React, {useEffect} from 'react';
import {BrandColor} from '../constants/colors';

import {getData} from '../../components/AsyncStorageHelpers';
import {userData} from '../../constants/StorageHelpers';
import Header from '../../components/Header';

const SplashScreen = ({navigation}) => {
  const checkLogin = async () => {
    getData(userData).then(async data => {
      if (data != null) {
        const {type} = data;
        if (type === 1) {
          navigation.reset({
            index: 0,
            routes: [{name: 'CustomerNavigator'}],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }
      } else {
        // console.log('Data not present');
        navigation.reset({
          index: 0,
          routes: [{name: 'MainScreen'}],
        });
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      checkLogin();
    }, 4000);
  }, []);


  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <Image
        source={require('../../assets/figma/logo.png')}
        style={styles.image}
      />
      <Header>BrickedIN</Header>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
