import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {projectId} from '../../../constants/StorageHelpers';
import {getData} from '../../../components/AsyncStorageHelpers';
import {
  GreenText,
  hitLink,
  GreyFill,
  GreyStroke,
  GreyText,
  TextColor,
  BrandColor,
} from '../../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import {Formik} from 'formik';
import Background from '../../../components/Background';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import {nameValidator} from '../../../helpers/Validators';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Header from '../../../components/Header';
import FullScreenLoading from '../../../components/FullScreenLoading';

const MaterialScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState(0);
  const inputs = [
    {label: 'Electrical', value: 0},
    {label: 'Modelling', value: 1},
    {label: 'Walls', value: 2},
  ];

  const newInputs = [
    {label: 'All', value: 4},
    {label: 'Electrical', value: 0},
    {label: 'Modelling', value: 1},
    {label: 'Building', value: 2},
  ];
  const [material, setMaterial] = useState('Brick');
  const materialsOptions = [
    {label: 'Brick', value: 'Brick'},
    {label: 'Steel', value: 'Steel'},
    {label: 'Fine Aggregate(Sand)', value: 'Fine Aggregate(Sand'},
    {label: 'Coarse Aggregate', value: 'Coarse Aggregate'},
    {label: 'Cement', value: 'Cement'},
    {label: 'Timber', value: 'Timber'},
    {label: 'Pipes', value: 'Pipes'},
    {label: 'Fabrics', value: 'Fabrics'},
    {label: 'Tiles', value: 'Tiles'},
    {label: 'Marbles', value: 'Marbles'},
    {label: 'Stones', value: 'Stones'},
    {label: 'Wood poles', value: 'Wood Poles'},
    {label: 'Plywood', value: 'Plywood'},
    {label: 'Binding wire & ropes', value: 'Binding wire & ropes'},
    {label: 'Other', value: 0},
  ];

  const [initialData, setInitialData] = useState([]);

  const [productName, setProductName] = useState({value: '', error: ''});
  const [showManualProduct, setShowManualProduct] = useState(false);
  const [dimensions, setDimensions] = useState({value: '', error: ''});
  const [description, setDescription] = useState({value: '', error: ''});
  const [finalData, setFinalData] = useState(initialData);
  const [projectNameId, setProjectNameId] = useState();

  const [tagType, settagType] = useState(4);

  const getMaterials = async () => {
    setIsLoading(true);
    await getData(projectId).then(async resp => {
      if (resp != null) {
        const url = `${hitLink}/project/material?id=${resp.id}`;
        setProjectNameId(resp.id);
        await fetch(url, {
          method: 'GET',
        })
          .then(respon => {
            respon
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  setInitialData(message);
                  setFinalData(message);
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
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    setFinalData([]);
    if (tagType == 4) {
      setFinalData(initialData);
    } else {
      initialData.filter(item => {
        if (item.tagType == tagType)
          setFinalData(finalData => [item, ...finalData]);
      });
    }
    setIsLoading(false);
  }, [tagType]);

  const detailsMaterial = (mid, name) => {
    const data = {id: mid, name: name};
    navigation.navigate('MaterialDetails', data);
  };

  useFocusEffect(
    React.useCallback(() => {
      getMaterials();
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => detailsMaterial(item.id, item.material)}
      style={styles.rowContainer}>
      <View style={styles.leftContainer}>
        <Text style={styles.materialHeading}>{item.material}</Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>
            {newInputs[item.tagType + 1].label}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.subHeading, {color: GreenText}]}>
          {item.total}
        </Text>
        <Text style={styles.subHeading}>{item.left}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSave = (values, setSubmitting) => {
    const url = `${hitLink}/project/material`;

    let fd = new FormData();
    if (material == 0) {
      fd.append('name', values.productName);
    } else {
      fd.append('name', material);
    }
    fd.append('dimensions', values.dimensions);
    fd.append('description', values.description);
    fd.append('tag', category);
    fd.append('id', projectNameId);

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
              setModalVisible(false);
              getMaterials();
            } else {
              setSubmitting(false);
              console.log(message);
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

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <Dropdown inputs={newInputs} value={tagType} setValue={settagType} />
      <View style={styles.headingContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.heading}>Material</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.subHeading}>TotalIn</Text>
          <Text style={styles.subHeading}>Remaining</Text>
        </View>
      </View>
      {finalData.length > 0 ? (
        <FlatList
          style={{marginBottom: '20%'}}
          showsVerticalScrollIndicator={false}
          data={finalData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No Material Found</Text>
      )}
      <View style={styles.bottomContainer}>
        <Button
          text="ADD a New Material"
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Formik
          initialValues={{
            description: '',
            productName: '',
            dimensions: '',
          }}
          onSubmit={(values, {setSubmitting}) => {
            const productError = nameValidator(values.productName);
            const dimError = nameValidator(values.dimensions);
            const desError = nameValidator(values.description);
            if (dimError || desError) {
              setDescription({...description, error: desError});
              setDimensions({...dimensions, error: dimError});
              if (productError && material == 0) {
                setProductName({...productName, error: productError});
              }
              setSubmitting(false);
              return;
            }

            if (productError && material == 0) {
              setProductName({...productName, error: productError});
              setSubmitting(false);
              return;
            }
            handleSave(values, setSubmitting);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
            <View style={styles.modalContainer}>
              <Header>Add a new Material</Header>

              <AntDesignIcon
                onPress={() => setModalVisible(false)}
                style={styles.icon}
                name="closecircle"
                size={24}
                color={BrandColor}
              />

              <Dropdown
                label={'Category'}
                inputs={inputs}
                value={category}
                setValue={setCategory}
              />

              <Dropdown
                label={'Materials'}
                inputs={materialsOptions}
                value={material}
                setValue={value => {
                  setMaterial(value);
                  if (value == 0) {
                    setShowManualProduct(true);
                  } else {
                    setShowManualProduct(false);
                  }
                }}
              />

              {showManualProduct && (
                <TextInput
                  label={'Material Name'}
                  icon="scale"
                  value={values.productName}
                  errorText={productName.error}
                  onChangeText={handleChange('productName')}
                  onBlur={handleBlur('productName')}
                />
              )}

              <TextInput
                label={'Dimensions'}
                icon="scale"
                value={values.dimensions}
                errorText={dimensions.error}
                onChangeText={handleChange('dimensions')}
                onBlur={handleBlur('dimensions')}
              />

              <TextInput
                label={'Description'}
                icon="calendar-text"
                value={values.description}
                errorText={description.error}
                onChangeText={handleChange('description')}
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

export default MaterialScreen;

const styles = StyleSheet.create({
  headingContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
  },
  rowContainer: {
    borderRadius: 15,
    width: '98%',
    borderColor: GreyStroke,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'white',
    elevation: 5,
  },
  leftContainer: {
    width: '60%',
    justifyContent: 'center',
    padding: 5,
  },
  tagContainer: {
    padding: 2,
    width: '30%',
    backgroundColor: GreyFill,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: GreyText,
    fontFamily: 'ReemKufi-Regular',
    fontSize: 12,
  },
  rightContainer: {
    width: '40%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  heading: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 18,
    color: TextColor,
  },
  materialHeading: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 22,
    color: TextColor,
  },

  subHeading: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 15,
    color: TextColor,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
