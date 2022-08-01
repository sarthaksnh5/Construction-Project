import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {getData} from '../../../components/AsyncStorageHelpers';
import {projectId} from '../../../constants/StorageHelpers';
import Background from '../../../components/Background';
import {GreyFill, TextColor} from '../../../constants/colors';
import ProgressiveImage from '../../../components/ProgressiveImage';

const MorePhotos = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState([]);

  const getPhotos = async () => {
    const tempphotos = route.params.photos;
    let tempArray = [];
    let i = 0;
    let count = 0;
    let initArray = [];
    for (let photo in tempphotos) {
      initArray.push(tempphotos[count]);
      i = i + 1;
      if (i == 3) {
        tempArray.push(initArray);
        initArray = [];
        i = 0;
      }
      count = count + 1;
    }
    setPhotos(tempArray);
    setIsLoading(false);
  };

  useEffect(() => {
    getData(projectId).then(resp => {
      navigation.setOptions({
        title: resp.name,
      });
    });
    getPhotos();
    return () => {
      setIsLoading(true);
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const renderItem = ({item}) => (
    <View style={styles.mainContainer}>
      <View style={styles.dateContainer}>
        <ProgressiveImage
          containerStyle={{
            width: styles.image.width,
            height: styles.image.height,

            marginRight: styles.image.marginRight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={{uri: item[0].uri}}
          style={styles.image}
        />
        <Text style={styles.date}>{item[0].date}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Image
          progressiveRenderingEnabled={true}
          source={{uri: item[1].uri}}
          style={styles.image}
        />
        <Text style={styles.date}>{item[1].date}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Image
          progressiveRenderingEnabled={true}
          source={{uri: item[2].uri}}
          style={styles.image}
        />
        <Text style={styles.date}>{item[2].date}</Text>
      </View>
    </View>
  );
  return (
    <Background>
      <FlatList
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        data={photos}
        keyExtractor={item => item[0].id}
      />
    </Background>
  );
};

export default MorePhotos;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 15,
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontFamily: 'ReemKufi-Regular',
    fontSize: 15,
    color: TextColor,
  },
});
