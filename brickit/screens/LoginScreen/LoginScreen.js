import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import {Formik} from 'formik';
import TextInput from '../../components/TextInput';
import FullScreenLoading from '../../components/FullScreenLoading';
import Paragraph from '../../components/Paragraph';
import Button from '../../components/Button';
import {emailValidator, passwordValidator} from '../../helpers/Validators';
import {appName, hitLink} from '../../constants/colors';
import BackgroundTimer from 'react-native-background-timer';
import {
  getNotificationData,
  storeData,
} from '../../components/AsyncStorageHelpers';
import {userData} from '../../constants/StorageHelpers';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    return () => {};
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const login = (values, setSubmitting) => {
    const url = `${hitLink}/user/user?email=${values.email}&password=${values.password}&filter=0`;
    // console.log(url);

    fetch(url, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              const {type} = message;
              storeData(userData, message);
              BackgroundTimer.runBackgroundTimer(() => {
                getNotificationData();
              }, 1000);
              if (type == 1) {
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
              setPassword({...password, error: message});
            }
            setSubmitting(false);
          })
          .catch(e => {
            console.log(e);
            setPassword({
              ...password,
              error: 'Server error! Please try again later.',
            });
            setSubmitting(false);
          });
      })
      .catch(e => {
        console.log(e);
        setPassword({
          ...password,
          error: 'Server error! Please try again later.',
        });
        setSubmitting(false);
      });
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome to {appName}</Header>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={(values, {setSubmitting}) => {
          setPassword({value: '', error: ''});
          setEmail({value: '', error: ''});
          const emailError = emailValidator(values.email);
          const passError = passwordValidator(values.password);
          if (emailError || passError) {
            setEmail({...email, error: emailError});
            setPassword({...password, error: passError});
            setSubmitting(false);
          } else {
            login(values, setSubmitting);
          }
        }}>
        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
          <>
            <TextInput
              label="Email Address"
              icon="email"
              value={values.email}
              errorText={email.error}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
            />

            <TextInput
              label="Password"
              placeholder="************"
              value={values.password}
              errorText={password.error}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              isPassword={true}
              secureTextEntry={showPassword}
              setShowPassword={setShowPassword}
              icon={'lock-outline'}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ResetPassword');
              }}
              style={{alignItems: 'flex-end', width: '100%'}}>
              <Paragraph>Forgot Password?</Paragraph>
            </TouchableOpacity>
            <Button
              text="LOGIN"
              isLoading={isSubmitting}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </Background>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
