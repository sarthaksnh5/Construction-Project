import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {
  BrandColor,
  GreenText,
  GreyStroke,
  hitLink,
  TextColor,
  YellowColor,
} from '../../../constants/colors';
import FullScreenLoading from '../../../components/FullScreenLoading';
import Background from '../../../components/Background';
import {useFocusEffect} from '@react-navigation/native';
import {getData, storeData} from '../../../components/AsyncStorageHelpers';
import {projectId, TaskDetial} from '../../../constants/StorageHelpers';

const CustomerTask = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [complete, setComplete] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [initialData, setInitialData] = useState([]);

  const getTasks = async () => {
    setIsLoading(true);
    await getData(projectId).then(async resp => {
      if (resp != null) {
        const {id} = resp;
        const url = `${hitLink}/project/alltask?id=${id}`;
        fetch(url, {
          method: 'GET',
        })
          .then(respon => {
            respon
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  if (message == 0) {
                    setInitialData([]);
                    setIsLoading(false);
                  } else {
                    const {totalTask, taskComplete, taskinComplete, taskData} =
                      message;
                    setTotal(totalTask);
                    setComplete(taskComplete);
                    setIncomplete(taskinComplete);
                    setInitialData(taskData);
                    setIsLoading(false);
                  }
                } else {
                  console.log(message);
                  setIsLoading(false);
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

  useFocusEffect(
    React.useCallback(() => {
      getTasks();
      return () => {
        setIsLoading(true);
      };
    }, []),
  );

  const taskDetails = (id, name) => {
    storeData(TaskDetial, {id: id, name: name});
    navigation.navigate('customerDetailTask');
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => taskDetails(item.id, item.name)}
      style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.leftContainer}>
          <View style={{width: '20%', justifyContent: 'center'}}>
            <Text style={styles.text}>{item.start}</Text>
          </View>
          <View style={{width: '60%', justifyContent: 'center'}}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
          <View
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>{item.end}</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.text}>{item.progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.mainContainer}>
        <View style={styles.detailsContainer}>
          <View style={styles.dataContainer}>
            <Text
              style={[
                styles.text,
                {color: TextColor},
                Platform.OS == 'ios' ? {fontSize: 15} : {fontSize: 17},
              ]}>
              Total
            </Text>
            <Text style={[styles.text, {color: TextColor, fontSize: 15}]}>
              {total}
            </Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.dataContainer}>
            <Text
              style={[
                styles.text,
                {color: YellowColor},
                Platform.OS == 'ios' ? {fontSize: 15} : {fontSize: 17},
              ]}>
              Running
            </Text>
            <Text style={[styles.text, {color: YellowColor, fontSize: 15}]}>
              {incomplete}
            </Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.dataContainer}>
            <Text
              style={[
                styles.text,
                {color: GreenText},
                Platform.OS == 'ios' ? {fontSize: 15} : {fontSize: 17},
              ]}>
              Completed
            </Text>
            <Text style={[styles.text, {color: GreenText, fontSize: 15}]}>
              {complete}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.heading}>
        <View
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Starts</Text>
        </View>
        <View style={{width: '45%', justifyContent: 'center'}}>
          <Text style={styles.text}>Task Name</Text>
        </View>
        <View style={{width: '15%', justifyContent: 'center'}}>
          <Text style={styles.text}>Ends</Text>
        </View>
        <View
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Progress</Text>
        </View>
      </View>
      {initialData.length > 0 ? (
        <FlatList
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={initialData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No Task initialized yet</Text>
      )}
    </Background>
  );
};

export default CustomerTask;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  listContainer: {
    marginBottom: '20%',
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
  dataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
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
    fontSize: 12,
    color: TextColor,
  },
  heading: {
    flexDirection: 'row',
    width: '100%',
    marginTop: '35%',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    justifyContent: 'space-around',
  },
  leftContainer: {
    width: '78%',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GreyStroke,
    padding: 5,
    flexDirection: 'row',
    elevation: 5,
  },
  rightContainer: {
    width: '18%',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GreenText,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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
