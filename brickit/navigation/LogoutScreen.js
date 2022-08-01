import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {logoutFunction} from '../components/AsyncStorageHelpers';
import Background from '../components/Background';
import Header from '../components/Header';

const LogoutScreen = ({navigation}) => {
  useEffect(() => {
    logoutFunction(navigation);
  }, []);

  return (
    <Background>
      <Header>See You Again</Header>
    </Background>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({});
