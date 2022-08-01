import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  BrandColor,
  DangerText,
  GreenText,
  GreyStroke,
  LightGreenText,
  TextColor,
} from '../constants/colors';
import Dropdown from './Dropdown';

const TablesData = ({initialData}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [finalData, setFinalData] = useState([]);
  const [entryType, setEntryType] = useState(0);
  const inputs = [
    {label: 'All', value: 0},
    {label: 'IN', value: 1},
    {label: 'OUT', value: 2},
  ];

  useEffect(() => {
    setFinalData(initialData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setFinalData([]);
    if (entryType == 0) setFinalData(initialData);
    else {
      initialData.filter(item => {
        if (item.type == entryType) {
          setFinalData(finalData => [item, ...finalData]);
        }
      });
    }
    setIsLoading(false);
  }, [entryType]);

  const renderItem = ({item}) => (
    <View style={styles.rowContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.dateText}>
          {item.date} {item.type == 1 ? 'From ' : 'To'} {item.user}
        </Text>
        <Text style={styles.headingText}>{item.description}</Text>
      </View>
      <View style={styles.entryType}>
        <View style={[styles.inCell]}>
          <Text style={styles.inText}>{item.type == 1 && item.amount}</Text>
        </View>
        <View style={styles.outCell}>
          <Text style={styles.outText}>{item.type == 2 && item.amount}</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} color={BrandColor} />
      </View>
    );
  }

  return (
    <View style={styles.contianer}>
      <Dropdown
        label={'Entry Type'}
        inputs={inputs}
        value={entryType}
        setValue={setEntryType}
      />
      <View style={styles.headerRow}>
        <View style={styles.entryDiv}>
          <Text style={styles.text}>Entries</Text>
        </View>
        <View style={styles.entryType}>
          <Text adjustsFontSizeToFit style={styles.text}>
            + Recieved
          </Text>
          <Text adjustsFontSizeToFit style={styles.text}>
            - Used
          </Text>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={finalData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default TablesData;

const styles = StyleSheet.create({
  contianer: {
    width: '100%',
    marginTop: '50%',
    marginBottom: '60%',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  entryDiv: {
    width: '65%',
  },
  text: {
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    fontSize: 15,
  },
  entryType: {
    width: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowContainer: {
    borderWidth: 0.5,
    borderColor: GreyStroke,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 15,
    marginBottom: 10,
    padding: 5,
    flexDirection: 'row',
  },
  innerContainer: {
    width: '65%',
    padding: 2,
  },
  dateText: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 15,
    color: TextColor,
  },
  headingText: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 22,
    color: TextColor,
  },
  inCell: {
    backgroundColor: LightGreenText,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderRadius: 10,
  },
  inText: {
    fontFamily: 'ReemKufi-SemiBold',
    color: GreenText,
    fontSize: 15,
  },
  outCell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderRadius: 10,
  },
  outText: {
    fontFamily: 'ReemKufi-SemiBold',
    color: DangerText,
    fontSize: 15,
  },
});
