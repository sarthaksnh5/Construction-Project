import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {getData, storeData} from '../../../components/AsyncStorageHelpers';
import {userData} from '../../../constants/StorageHelpers';
import {GreyStroke, hitLink, TextColor} from '../../../constants/colors';
import Background from '../../../components/Background';
import Paragraph from '../../../components/Paragraph';
import {Formik} from 'formik';
import Button from '../../../components/Button';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  emailValidator,
  mobileValidator,
  nameValidator,
} from '../../../helpers/Validators';
import TextInput from '../../../components/TextInput';
import ProgressiveImage from '../../../components/ProgressiveImage';

const EditUserDetailsScreen = ({navigation}) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [name, setName] = useState({value: '', error: ''});
  const [number, setNumber] = useState({value: '', error: ''});
  const [image, setImage] = useState({name: '', type: '', uri: ''});
  const [userId, setUserId] = useState(0);

  const [isLoadign, setIsLoadign] = useState(true);

  const getUserData = async () => {
    getData(userData).then(async resp => {
      if (resp != null) {
        const {id, type} = resp;
        setUserId(id);
        let url = `${hitLink}/user/employee?id=${id}`;

        await fetch(url, {
          method: 'GET',
        })
          .then(respon => {
            respon
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  console.log(message);
                  setName({value: message.name, error: ''});
                  setEmail({value: message.email, error: ''});
                  const {mobile} = message;
                  const imageGet = message.image;
                  setNumber({value: mobile, error: ''});
                  if (imageGet != '') {
                    setImage({name: '', type: '', uri: imageGet});
                  }
                  setIsLoadign(false);
                } else {
                  console.log(message);
                  navigation.pop();
                }
              })
              .catch(e => {
                console.log(e);
                navigation.pop();
              });
          })
          .catch(e => {
            console.log(e);
            navigation.pop();
          });
      }
    });
  };

  const handleLogin = async (values, setSubmitting) => {
    const url = `${hitLink}/user/employee`;
    let fd = new FormData();
    fd.append('id', values.id);
    fd.append('name', values.name);
    fd.append('email', values.email);
    fd.append('number', values.number);
    image.name == '' ? fd.append('image', 0) : fd.append('image', image);
    await fetch(url, {
      method: 'PUT',
      body: fd,
    })
      .then(resp =>
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              console.log(message);
              storeData(userData, message);
              navigation.pop();
            }
          })
          .catch(e => console.log(e)),
      )
      .catch(e => console.log(e));

    setSubmitting(false);
  };

  const pickImage = async setSubmitting => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (!result.didCancel) {
      setImage({
        name: result.assets[0].fileName,
        type: result.assets[0].type,
        uri: result.assets[0].uri,
      });
    } else {
      setImage('');
    }
    setSubmitting(false);
  };

  useEffect(() => {
    getUserData();
    return () => {
      setIsLoadign(true);
    };
  }, []);

  if (isLoadign) {
    return <FullScreenLoading />;
  }
  return (
    <Background barStyle="dark-content" bgColor="white">
      <Paragraph>This information will not be shared with anyone</Paragraph>
      <View style={styles.card}>
        <View>
          <Text style={styles.heading}>Edit Info</Text>
        </View>
        <View style={styles.imageContainer}>
          <Formik
            initialValues={{}}
            onSubmit={(values, {setSubmitting}) => {
              pickImage(setSubmitting);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <>
                {image.uri != '' && (
                  <ProgressiveImage
                    containerStyle={{
                      width: styles.image.width,
                      height: styles.image.height,

                      marginRight: styles.image.marginRight,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    source={{uri: image.uri}}
                    style={styles.image}
                  />
                )}
                <Button
                  text="Change"
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                  mode={'outlined'}
                />
              </>
            )}
          </Formik>
        </View>
        <View style={styles.innerContainer}>
          {number.value != '' && (
            <Formik
              initialValues={{
                id: userId,
                name: name.value,
                email: email.value,
                number: number.value,
              }}
              onSubmit={(values, {setSubmitting}) => {
                const nameError = nameValidator(values.name);
                const emailError = emailValidator(values.email);
                const mobileError = mobileValidator(values.number);

                if (nameError || emailError || mobileError) {
                  setName({...name, error: nameError});
                  setEmail({...email, error: emailError});
                  setNumber({...number, error: mobileError});
                  setSubmitting(false);
                  return;
                }

                handleLogin(values, setSubmitting);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                isSubmitting,
              }) => (
                <>
                  <TextInput
                    label="Name"
                    icon="account"
                    value={values.name}
                    errorText={name.error}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                  />

                  <TextInput
                    label="Email Address"
                    icon="email"
                    value={values.email}
                    errorText={email.error}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />

                  <TextInput
                    label="Mobile Number"
                    icon="cellphone"
                    value={values.number}
                    errorText={number.error}
                    keyboardType={'numeric'}
                    onChangeText={handleChange('number')}
                    onBlur={handleBlur('number')}
                  />

                  <Button
                    text="SAVE"
                    isLoading={isSubmitting}
                    onPress={handleSubmit}
                  />
                </>
              )}
            </Formik>
          )}
        </View>
      </View>
    </Background>
  );
};

export default EditUserDetailsScreen;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 15,
    padding: 5,
    marginVertical: 15,
    borderWidth: 0.5,
    borderColor: GreyStroke,
  },
  heading: {
    fontSize: 25,
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 49,
  },
});
