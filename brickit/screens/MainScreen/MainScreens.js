import {StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../components/Background';
import FullScreenLoading from '../../components/FullScreenLoading';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import Button from '../../components/Button';
import {appName} from '../../constants/colors';

const MainScreens = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    return () => {
      setIsLoading(false);
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <Logo />
      <Header>Welcome to {appName}</Header>
      <Paragraph>The easiest way to get through your dream home.</Paragraph>
      <Button
        text={'LOGIN'}
        onPress={() => {
          navigation.replace('Login');
        }}
      />
      <Button
        text={'Reset Password'}
        mode={'outlined'}
        onPress={() => {
          navigation.navigate('ResetPassword');
        }}
      />
    </Background>
  );
};

export default MainScreens;

const styles = StyleSheet.create({});
