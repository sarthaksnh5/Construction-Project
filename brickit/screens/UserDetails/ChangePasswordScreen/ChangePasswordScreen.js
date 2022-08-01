import {StyleSheet, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {getData} from '../../../components/AsyncStorageHelpers';
import {userData} from '../../../constants/StorageHelpers';
import {hitLink} from '../../../constants/colors';
import SnackbarHelper from '../../../components/SnackbarHelper';
import Background from '../../../components/Background';
import {Formik} from 'formik';
import {passwordValidator} from '../../../helpers/Validators';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';

const ChangePasswordScreen = ({navigation}) => {
  const [newPassword, setNewPassword] = useState({value: '', error: ''});
  const [oldPassword, setoldPassword] = useState({value: '', error: ''});
  const [showNew, setShowNew] = useState(true);
  const [showOld, setShowOld] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [snackData, setSnackData] = useState('');
  const [duration, setDuration] = useState(2000);

  const [showSnack, setShowSnack] = useState(false);

  const submitEmail = (values, setSubmitting) => {
    const url = `${hitLink}/user/changePassword`;
    getData(userData).then(async resp => {
      if (resp != null) {
        let fd = new FormData();
        fd.append('oldPassword', values.old);
        fd.append('newPassword', values.new);
        fd.append('name', resp.name);

        await fetch(url, {
          method: 'POST',
          body: fd,
        })
          .then(respon => {
            respon
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  setSnackData('Password Change successfull');
                  setShowSnack(true);
                  setTimeout(() => {
                    navigation.goBack();
                  }, 3000);
                } else {
                  setNewPassword({...newPassword, error: message});
                }
              })
              .catch(e => {
                console.log(e);
                setSubmitting(false);
              });
          })
          .catch(e => {
            console.log(e);
            setSubmitting(false);
          });
      }
    });
    setSubmitting(false);
  };

  useEffect(() => {
    setIsLoading(false);
    
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <ScrollView contentContainerStyle={{width: '100%', height: '100%'}}>
      <Background barStyle="dark-content" bgColor="white">
        <Formik
          initialValues={{old: '', new: ''}}
          onSubmit={(values, {setSubmitting}) => {
            const newError = passwordValidator(values.new);
            const oldError = passwordValidator(values.old);
            if (newError || oldError) {
              setNewPassword({...newPassword, error: newError});
              setoldPassword({...oldPassword, error: oldError});
              setSubmitting(false);
              return true;
            }

            submitEmail(values, setSubmitting);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <>
              <TextInput
                label="Old Password"
                value={values.old}
                onChangeText={handleChange('old')}
                onBlur={handleBlur('old')}
                error={!!oldPassword.error}
                errorText={oldPassword.error}
                icon="lock-outline"
                isPassword={true}
                secureTextEntry={showOld}
                setShowPassword={setShowOld}
              />
              <TextInput
                label="New Password"
                placeholder="************"
                value={values.new}
                errorText={newPassword.error}
                onChangeText={handleChange('new')}
                onBlur={handleBlur('new')}
                isPassword={true}
                secureTextEntry={showNew}
                setShowPassword={setShowNew}
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
        <SnackbarHelper
          showSnack={showSnack}
          content={snackData}
          setShowSnack={setShowSnack}
        />
      </Background>
    </ScrollView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({});
