import {StyleSheet, Text, View, Modal, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';
import {
  BrandColor,
  DangerText,
  GreenText,
  GreyFill,
  GreyStroke,
  GreyText,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import TextInput from '../../../components/TextInput';
import Dropdown from '../../../components/Dropdown';
import FullScreenLoading from '../../../components/FullScreenLoading';
import OperationButton from '../../../components/OperationButton';
import {Formik} from 'formik';
import {nameValidator} from '../../../helpers/Validators';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Header from '../../../components/Header';
import Button from '../../../components/Button';

const DetailsMaterialScreen = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [entryType, setEntryType] = useState(0);
  const [amount, setAmount] = useState({value: '', error: ''});
  const [description, setDescription] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);
  const [materialId, setMaterialId] = useState();
  const [totalIn, setTotalIn] = useState(0);
  const [totalOut, setTotalOut] = useState(0);
  const [left, setLeft] = useState(0);

  const inputs = [
    {label: '+ IN', value: 1},
    {label: '- OUT', value: 2},
  ];

  const getMaterialData = async id => {
    setIsLoading(true);
    const url = `${hitLink}/project/materialquantity?id=${id}`;

    await fetch(url, {
      method: 'GET',
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            const {result, message} = response;
            if (result && message != 0) {
              const {balance, inBalance, outBalance, data} = message;
              setLeft(balance);
              setTotalIn(inBalance);
              setTotalOut(outBalance);
              setInitialData(data);
            } else {
              setLeft(0);
              setTotalIn(0);
              setTotalOut(0);
              setInitialData([]);
            }
          })
          .catch(e => {
            console.log(e);
            navigation.goBack();
            setIsLoading(false);
          });
      })
      .catch(e => {
        console.log(e);
        navigation.goBack();
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const {name, id} = route.params;
      navigation.setOptions({
        title: name,
      });
      setMaterialId(id);
      getMaterialData(id);

      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/materialquantity`;

    let fd = new FormData();
    fd.append('id', materialId);
    fd.append('type', entryType);
    fd.append('amount', values.quantity);
    fd.append('description', values.description);

    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            const {result, message} = response;
            if (result && message != 0) {
              setModalVisible(false);
              getMaterialData(materialId);
            } else if (message == 0) {
              setInitialData([]);
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

  const renderItem = ({item}) => (
    <View style={styles.rowContainer}>
      <View style={styles.container}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.objective}>{item.description}</Text>
      </View>
      <View
        style={[
          styles.container,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <Text
          style={[
            styles.stat,
            {color: item.type == 1 ? GreenText : DangerText},
          ]}>
          {item.type == 1 ? 'IN' : 'OUT'}
        </Text>
        <Text
          style={[
            styles.quantityStat,
            {color: item.type == 1 ? GreenText : DangerText},
          ]}>
          {item.amount}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.topContainer}>
        <Text style={styles.value}>{left}</Text>
        <Text style={styles.tag}>Remaining on site</Text>
        <View style={styles.upperbottomContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.inHeadText}>Recieved</Text>
            <Text style={styles.inText}>{totalIn}</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.leftContainer}>
            <Text style={styles.outHeadText}>Used</Text>
            <Text style={styles.outText}>{totalOut}</Text>
          </View>
        </View>
      </View>
      <View style={styles.headingRow}>
        <Text style={styles.text}>Materials Entries</Text>
        <Text style={styles.text}>Quantity</Text>
      </View>
      {initialData.length > 0 ? (
        <FlatList
          contentContainerStyle={{marginBottom: '25%', width: '60%'}}
          showsVerticalScrollIndicator={false}
          data={initialData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No Quantity Entries</Text>
      )}
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
          initialValues={{quantity: '', description: ''}}
          onSubmit={(values, {setSubmitting}) => {
            const quanError = nameValidator(values.quantity);
            const desError = nameValidator(values.description);

            if (quanError || desError) {
              setAmount({...amount, error: quanError});
              setDescription({...description, error: desError});
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
                label={'Quantity'}
                icon="cash-100"
                value={values.quantity}
                errorText={amount.error}
                onChangeText={handleChange('quantity')}
                onBlur={handleBlur('quantity')}
                keyboardType="numeric"
              />

              <TextInput
                label={'Description'}
                icon="chart-ppf"
                value={values.description}
                errorText={description.error}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
              />

              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Dropdown
                  label={'Entry Type'}
                  inputs={inputs}
                  value={entryType}
                  setValue={setEntryType}
                />
              </View>

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

export default DetailsMaterialScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '40%',
  },
  topContainer: {
    backgroundColor: BrandColor,
    width: '112%',
    height: '20%',
    top: 0,
    position: 'absolute',
    elevation: 10,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontFamily: 'ReemKufi-SemiBold',
    color: 'white',
    fontSize: 25,
  },
  tag: {
    fontFamily: 'ReemKufi-Regular',
    color: 'white',
    fontSize: 18,
  },
  upperbottomContainer: {
    width: '80%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '-12%',
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    borderRadius: 15,
    height: '60%',
  },
  line: {
    width: '0.5%',
    backgroundColor: GreyFill,
    height: '80%',
  },
  leftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  inText: {
    fontFamily: 'ReemKufi-Regular',
    color: GreenText,
    fontSize: 20,
  },
  inHeadText: {
    fontFamily: 'ReemKufi-SemiBold',
    color: GreenText,
    fontSize: 18,
  },
  outText: {
    fontFamily: 'ReemKufi-Regular',
    color: DangerText,
    fontSize: 20,
  },
  outHeadText: {
    fontFamily: 'ReemKufi-SemiBold',
    color: DangerText,
    fontSize: 18,
  },
  headingRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: '60%',
  },
  text: {
    fontFamily: 'ReemKufi-Regular',
    color: TextColor,
    fontSize: 15,
  },
  headingText: {
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    fontSize: 18,
  },
  specialText: {
    fontFamily: 'ReemKufi-Regular',
    fontSize: 15,
  },
  rowContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    elevation: 5,
    borderWidth: 1,
    borderColor: GreyStroke,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  container: {
    justifyContent: 'center',
  },
  date: {
    color: GreyText,
    fontSize: 13,
    fontFamily: 'ReemKufi-Regular',
  },
  objective: {
    color: TextColor,
    fontSize: 18,
    fontFamily: 'ReemKufi-SemiBold',
  },
  stat: {
    fontSize: 13,
    fontFamily: 'ReemKufi-Regular',
  },
  quantityStat: {
    fontSize: 18,
    fontFamily: 'ReemKufi-SemiBold',
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
