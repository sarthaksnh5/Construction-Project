import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../components/Background';
import Paragraph from '../../components/Paragraph';
import {Formik} from 'formik';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import FullScreenLoading from '../../components/FullScreenLoading';
import {nameValidator, passwordValidator} from '../../helpers/Validators';
import {hitLink} from '../../constants/colors';
import SnackbarHelper from '../../components/SnackbarHelper';

const NewPasswordScreen = ({navigation, route}) => {
  const [token, setToken] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [snackData, setSnackData] = useState('');
  const [duration, setDuration] = useState(2000);

  const [showSnack, setShowSnack] = useState(false);
  const email = route.params.email;

  useEffect(() => {
    setIsLoading(false);
    return () => {};
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const submitEmail = (values, setSubmitting) => {
    const url = `${hitLink}/api/password_reset/confirm/`;

    let fd = new FormData();
    fd.append('token', values.token);
    fd.append('password', values.password);

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(response => {
        response.json().then(resp => {
          if ('status' in resp) {
            setShowSnack(true);
            setSnackData('Password reset successfull');
            setShowSnack(true);
            setDuration(3000);
            setTimeout(() => {
              navigation.replace('Login');
            }, 3000);
          } else {
            let details = '';
            if ('detail' in resp) {
              details = resp.detail;
            } else if ('password' in resp) {
              details = resp.password;
            }
            setPassword({value: '', error: details});
          }
          setSubmitting(false);
        });
      })
      .catch(e => {
        setPassword({
          value: '',
          error: 'Network error occured, Please try again later',
        });
        setSubmitting(false);
        console.log(e);
      });
  };

  const sentToke = async () => {
    setTokenLoading(true);
    const url = `${hitLink}/api/password_reset/`;

    let fd = new FormData();
    fd.append('email', email);

    await fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(response => {
        response.json().then(resp => {
          setTokenLoading(false);
          setSnackData('Token sent');
          setShowSnack(true);
        });
      })
      .catch(e => {
        setPassword({
          value: '',
          error: 'Network error occured, Please try again later',
        });
        setTokenLoading(false);
        console.log(e);
      });
  };

  return (
    <ScrollView contentContainerStyle={{width: '100%', height: '100%'}}>
      <Background>
        <Paragraph>Authorization Token sent to mail</Paragraph>
        <Formik
          initialValues={{token: '', password: ''}}
          onSubmit={(values, {setSubmitting}) => {
            const tokenerror = nameValidator(values.token);
            const passError = passwordValidator(values.password);
            if (tokenerror || passError) {
              setToken({...token, error: tokenerror});
              setPassword({...password, error: passError});
              setSubmitting(false);
              return;
            } else {
              submitEmail(values, setSubmitting);
            }
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <>
              <TextInput
                label="Token"
                value={values.token}
                onChangeText={handleChange('token')}
                onBlur={handleBlur('token')}
                error={!!token.error}
                errorText={token.error}
                description="Token sent to your email address"
                icon="email"
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
              <Button
                text={'Submit'}
                onPress={handleSubmit}
                isLoading={isSubmitting}
              />
            </>
          )}
        </Formik>
        <Button
          text={'Resend Token'}
          isLoading={tokenLoading}
          mode={'outlined'}
          onPress={sentToke}
        />
      </Background>
      <SnackbarHelper
        content={snackData}
        showSnack={showSnack}
        setShowSnack={setShowSnack}
      />
    </ScrollView>
  );
};

export default NewPasswordScreen;

const styles = StyleSheet.create({});
