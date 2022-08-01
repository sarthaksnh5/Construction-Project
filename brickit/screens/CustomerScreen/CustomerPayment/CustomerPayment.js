import {StyleSheet, Text, View, FlatList, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getData} from '../../../components/AsyncStorageHelpers';
import {projectId} from '../../../constants/StorageHelpers';
import Background from '../../../components/Background';
import {GreyStroke, hitLink, TextColor} from '../../../constants/colors';
import FullScreenLoading from '../../../components/FullScreenLoading';

const CustomerPayment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  const getProjectPayment = async id => {
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
              const {data} = message;
              var temp = [];
              data.map(item => {
                if (item.type == 1) {
                  temp.push(item);
                }
              });
              setInitialData(temp);
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

  useFocusEffect(
    React.useCallback(() => {
      getData(projectId).then(resp => {
        getProjectPayment(resp.id);
      });
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const renderItem = ({item}) => (
    <View style={styles.rowContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.headingText}>{item.description}</Text>
      </View>
      <View style={styles.entryType}>
        <View style={styles.inCell}>
          <Text style={styles.inText}>{item.type == 1 && item.amount}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Background>
      <ScrollView>
        <View style={styles.container}>
          {initialData.length > 0 ? (
            <>
              <View style={styles.headerRow}>
                <View style={styles.entryDiv}>
                  <Text style={styles.text}>Entries</Text>
                </View>
                <View style={styles.entryType}>
                  <Text style={styles.text}>Amount</Text>
                </View>
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={initialData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </>
          ) : (
            <Text>No Payments made</Text>
          )}
        </View>
      </ScrollView>
    </Background>
  );
};

export default CustomerPayment;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  entryDiv: {
    width: '70%',
    paddingLeft: 10,
  },
  text: {
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    fontSize: 18,
  },
  entryType: {
    width: '30%',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inText: {
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    fontSize: 15,
  },
});
