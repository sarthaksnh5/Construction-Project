import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getData} from '../../../components/AsyncStorageHelpers';
import {
  BrandColor,
  GreenText,
  GreyFill,
  GreyStroke,
  GreyText,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import Background from '../../../components/Background';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {userData} from '../../../constants/StorageHelpers';
import Dropdown from '../../../components/Dropdown';

const CustomerMaterialScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);
  const [finalData, setFinalData] = useState(initialData);
  const [tagType, settagType] = useState(4);
  const newInputs = [
    {label: 'All', value: 4},
    {label: 'Electrical', value: 0},
    {label: 'Modelling', value: 1},
    {label: 'Building', value: 2},
  ];

  const getMaterials = async () => {
    setIsLoading(true);
    await getData(userData).then(async resp => {
      if (resp != null) {
        const url = `${hitLink}/project/material?id=${resp.project_id}`;
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

  const renderItem = ({item}) => (
    <View style={styles.rowContainer}>
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
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      getMaterials();
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
    </Background>
  );
};

export default CustomerMaterialScreen;

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
});
