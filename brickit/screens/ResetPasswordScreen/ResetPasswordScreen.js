import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Background from '../../components/Background';
import FullScreenLoading from '../../components/FullScreenLoading';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import {Formik} from 'formik';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import SnackbarHelper from '../../components/SnackbarHelper';
import {emailValidator} from '../../helpers/Validators';
import {appName, hitLink} from '../../constants/colors';

const ResetPasswordScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState({value: '', error: ''});
  const [showSnack, setShowSnack] = useState(false);
  const [snackContent, setSnackContent] = useState('');

  useEffect(() => {
    setIsLoading(false);
    return () => {};
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const submitEmail = (values, setSubmitting) => {
    const url = `${hitLink}/api/password_reset/`;

    let fd = new FormData();

    fd.append('email', values.email);

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(response => {
        response.json().then(resp => {
          if ('status' in resp) {
            setSnackContent('Email sent to ' + values.email);
            setShowSnack(true);
            setEmail({value: values.email, error: ''});
            setTimeout(() => {
              navigation.replace('NewPassword', {email: values.email});
            }, 3000);
          } else {
            const {email} = resp;
            setEmail({value: '', error: email});
          }
        });
        setSubmitting(false);
      })
      .catch(e => {
        setEmail({value: '', error: 'An error occured please try again'});
        console.log(e);
        setSubmitting(false);
      });
  };

  return (
    <Background>
      <Header>Welcome to {appName}</Header>
      <Paragraph>
        Password reset link will be sent to your registered email id
      </Paragraph>
      <Formik
        initialValues={{email: ''}}
        onSubmit={(values, {setSubmitting}) => {
          setEmail({value: '', error: ''});
          const emailError = emailValidator(values.email);
          if (emailError) {
            setEmail({...email, error: emailError});
            setSubmitting(false);
            return;
          }
          submitEmail(values, setSubmitting);
        }}>
        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
          <>
            <TextInput
              label="Email Address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={!!email.error}
              errorText={email.error}
              textContentType="emailAddress"
              keyboardType="email-address"
              placeholder="Email Address"
              description="You will receive email with password reset link."
              icon="email"
            />
            <Button
              text="Send token"
              onPress={handleSubmit}
              isLoading={isSubmitting}
            />
          </>
        )}
      </Formik>
      <SnackbarHelper
        showSnack={showSnack}
        setShowSnack={setShowSnack}
        content={snackContent}
      />
    </Background>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({});
