/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Modal} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';
import {
  BrandColor,
  DangerText,
  GreenText,
  hitLink,
  TextColor,
  GreyStroke,
  GreyFill,
} from '../../../constants/colors';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {getData, getProjectData} from '../../../components/AsyncStorageHelpers';
import {projectId} from '../../../constants/StorageHelpers';
import OperationButton from '../../../components/OperationButton';
import TablesData from '../../../components/TablesData';
import {Formik} from 'formik';
import {nameValidator} from '../../../helpers/Validators';
import Header from '../../../components/Header';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import {useFocusEffect} from '@react-navigation/native';

const PaymentScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [entryType, setEntryType] = useState(0);
  const [amount, setAmount] = useState({value: '', error: ''});
  const [description, setDescription] = useState({value: '', error: ''});
  const [owner, setOwner] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [totalIn, setTotalIn] = useState(0);
  const [totalOut, setTotalOut] = useState(0);
  const [projectDataId, setProjectDataId] = useState();

  const [initialData, setInitialData] = useState([]);

  const getPayments = async id => {
    setIsLoading(true);
    const url = `${hitLink}/project/payment?id=${id}`;
    await fetch(url, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            if (result && message != 0) {
              const {inBalance, outBalance, balanceL, data} = message;
              setTotalIn(inBalance);
              setTotalOut(outBalance);
              setBalance(balanceL);
              setInitialData(data);
              setIsLoading(false);
            } else if (message == 0) {
              setIsLoading(false);
            } else {
              setIsLoading(false);
              console.log(message);
            }
          })
          .catch(e => {
            console.log(e);
            setIsLoading(false);
          });
      })
      .catch(e => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/payment`;
    let fd = new FormData();

    fd.append('user', values.owner);
    fd.append('amount', values.amount);
    fd.append('description', values.description);
    fd.append('type', entryType);
    fd.append('project', projectDataId);

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              setModalVisible(false);
              getPayments(projectDataId);
              setSubmitting(false);
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

  // useEffect(() => {
  //   getProjectData(setProjectDataId);
  //   getData(projectId).then(resp => {
  //     if (resp != null) {
  //       getPayments(resp.id);
  //     }
  //   });
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProjectData(setProjectDataId);
      getData(projectId).then(resp => {
        if (resp != null) {
          getPayments(resp.id);
        }
      });
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.mainContainer}>
        <View style={styles.detailsContainer}>
          <View>
            <Text style={[styles.text, {color: TextColor, fontSize: 20}]}>
              Balance
            </Text>
            <Text style={[styles.text, {color: TextColor, fontSize: 15}]}>
              {balance}
            </Text>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={[styles.text, {color: GreenText, fontSize: 20}]}>
              Recieved
            </Text>
            <Text style={[styles.text, {color: GreenText, fontSize: 15}]}>
              + {totalIn}
            </Text>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={[styles.text, {color: DangerText, fontSize: 20}]}>
              Used
            </Text>
            <Text style={[styles.text, {color: DangerText, fontSize: 15}]}>
              - {totalOut}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        {initialData.length > 0 ? (
          <TablesData initialData={initialData} />
        ) : (
          <Text>No Payments made</Text>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <OperationButton
            text="Recieved"
            icon={'plus'}
            onPress={() => {
              setEntryType(1);
              setModalVisible(true);
            }}
            color={GreenText}
          />
        </View>
        <View style={styles.buttonContainer}>
          <OperationButton
            text="Used"
            icon={'minus'}
            onPress={() => {
              setEntryType(2);
              setModalVisible(true);
            }}
            color={DangerText}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Formik
          initialValues={{amount: '', description: '', owner: ''}}
          onSubmit={(values, {setSubmitting}) => {
            const amountError = nameValidator(values.amount);
            const descriptionError = nameValidator(values.description);
            const userError = nameValidator(values.owner);

            if (amountError || descriptionError || userError) {
              setAmount({...amount, error: amountError});
              setDescription({...description, error: descriptionError});
              setOwner({...owner, error: userError});
              setSubmitting(false);
              return;
            }

            handleSave(values, setSubmitting);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <View style={styles.modalContainer}>
              <Header>Add a new Entry</Header>
              <AntDesignIcon
                onPress={() => setModalVisible(false)}
                style={styles.icon}
                name="closecircle"
                size={24}
                color={BrandColor}
              />

              <TextInput
                label={'Amount'}
                icon="cash-100"
                value={values.amount}
                errorText={amount.error}
                onChangeText={handleChange('amount')}
                keyboardType="numeric"
              />

              <TextInput
                label={'Description'}
                icon="calendar-text"
                value={values.description}
                errorText={description.error}
                onChangeText={handleChange('description')}
              />

              <TextInput
                label={'To/From Whom'}
                icon="account"
                value={values.owner}
                errorText={owner.error}
                onChangeText={handleChange('owner')}
              />

              <Button
                text="Save"
                isLoading={isSubmitting}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </Modal>
    </Background>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mainContainer: {
    backgroundColor: BrandColor,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    position: 'absolute',
    top: 0,
    padding: 5,
    width: '110%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    position: 'absolute',
    top: '35%',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  line: {
    width: '0.25%',
    height: 70,
    backgroundColor: GreyStroke,
  },
  text: {
    fontFamily: 'ReemKufi-SemiBold',
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '40%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '112%',
    borderRadius: 15,
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: GreyFill,
  },
  modalContainer: {
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    borderWidth: 2,
    borderColor: GreyStroke,
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
});
