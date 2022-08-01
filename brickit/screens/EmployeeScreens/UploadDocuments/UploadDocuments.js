import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import {Formik} from 'formik';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import DocumentPicker from 'react-native-document-picker';
import Paragraph from '../../../components/Paragraph';
import {nameValidator} from '../../../helpers/Validators';
import {hitLink} from '../../../constants/colors';

const UploadDocuments = ({navigation, route}) => {
  const [filename, setFilename] = useState({value: '', error: ''});
  const [document, setDocument] = useState({name: '', uri: '', type: ''});

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setDocument({
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      });
    } catch (e) {
      setDocument({name: '', uri: '', type: ''});
      console.log(e);
    }
  };

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/document`;

    let fd = new FormData();
    fd.append('filename', values.filename);
    fd.append('document', document);
    fd.append('project', route.params.project);

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              console.log('Updated');
              navigation.goBack();
            } else {
              console.log(message);
              setSubmitting(false);
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
  };

  return (
    <Background>
      <Header>Project</Header>
      <Formik
        initialValues={{filename: ''}}
        onSubmit={(values, {setSubmitting}) => {
          const nameError = nameValidator(values.filename);
          const fileError = nameValidator(document.name);

          if (nameError || fileError) {
            setFilename({value: '', error: nameError});
            setDocument({name: fileError, uri: '', type: ''});
            setSubmitting(false);
            return;
          }
          handleSave(values, setSubmitting);
        }}>
        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
          <>
            <TextInput
              label="File Name"
              icon="attachment"
              value={values.filename}
              errorText={filename.error}
              onChangeText={handleChange('filename')}
              onBlur={handleBlur('filename')}
            />
            <Paragraph>{document.name}</Paragraph>
            <Button
              text={'Select Document'}
              mode={'outlined'}
              onPress={pickImage}
            />
            <Button
              text={'Save'}
              isLoading={isSubmitting}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </Background>
  );
};

export default UploadDocuments;

const styles = StyleSheet.create({});
