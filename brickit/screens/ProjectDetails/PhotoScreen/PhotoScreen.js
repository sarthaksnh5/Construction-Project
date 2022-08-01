import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {getData} from '../../../components/AsyncStorageHelpers';
import {
  BrandColor,
  GreyFill,
  GreyStroke,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import {projectId} from '../../../constants/StorageHelpers';
import {useFocusEffect} from '@react-navigation/native';
import Background from '../../../components/Background';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import ProgressiveImage from '../../../components/ProgressiveImage';
import ImageViewer from 'react-native-image-zoom-viewer';

const PhotoScreen = ({navigation}) => {
  const [isLoading, setisLoading] = useState(true);
  const [photos, setPhotos] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getPhotos = async () => {
    await getData(projectId).then(async resp => {
      const {id} = resp;
      const url = `${hitLink}/project/photo?id=${id}&filter=employee`;

      fetch(url, {
        method: 'GET',
      })
        .then(respon => {
          respon
            .json()
            .then(response => {
              const {result, message} = response;
              if (result) {
                if (message.length > 0) {
                  setPhotos(message);
                } else {
                  setPhotos(null);
                }
                setisLoading(false);
              } else {
                alert('Server Error');
                console.log(message);
              }
            })
            .catch(e => {
              console.log(e);
              setisLoading(false);
            });
        })
        .catch(e => {
          console.log(e);
          setisLoading(false);
        });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getPhotos();
      return () => {
        setisLoading(true);
      };
    }, []),
  );

  const renderImage = ({item}) => {
    const {uri} = item;
    const arrayFile = uri.split('.');
    const fileType = arrayFile[arrayFile.length - 1];
    const arrayFIlename = uri.split('/');
    const filename = arrayFIlename[arrayFIlename.length - 1];

    if (
      fileType.toLowerCase() == 'jpg' ||
      fileType.toLowerCase() == 'jpeg' ||
      fileType.toLowerCase() == 'png'
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}>
          <ProgressiveImage
            containerStyle={{
              width: styles.image.width,
              height: styles.image.height,
              marginRight: styles.image.marginRight,
            }}
            source={{uri: item.uri}}
            style={styles.image}
          />
        </TouchableOpacity>
      );
    } else {
      // return <Video source={{uri: item.uri}} style={styles.image} />;
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('VideoScreen', {url: item.uri});
          }}
          style={styles.videoContainer}>
          <Feather name="video" size={24} color={BrandColor} />
          <Text style={styles.filename}>{filename}</Text>
        </TouchableOpacity>
      );
    }
  };

  const changeScreen = () => {
    if (photos != null) {
      navigation.navigate('MorePhotos', {photos: photos});
    }
  };

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <View style={styles.mainContainer}>
        <View style={styles.headingRow}>
          <Text style={styles.heading}>Site Photos</Text>
          {/* <TouchableOpacity onPress={() => changeScreen()}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{width: '100%', flexDirection: 'row'}}>
          <TouchableOpacity style={styles.addImage}>
            <MCIcons name="image-plus" size={30} color={BrandColor} />
          </TouchableOpacity>
          {photos != null && (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={photos}
              renderItem={renderImage}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </View>
      <Modal
        animationType="fade"
        onRequestClose={() => {
          setShowModal(false);
        }}
        visible={showModal}>
        <ImageViewer imageUrls={photos} />
      </Modal>
    </Background>
  );
};

export default PhotoScreen;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    width: '100%',
  },
  headingRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
    fontSize: 18,
  },
  viewAllButton: {
    fontFamily: 'ReemKufi-SemiBold',
    color: BrandColor,
    fontSize: 15,
  },
  line: {
    width: '100%',
    backgroundColor: GreyFill,
    height: 2,
    marginVertical: 10,
  },
  image: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 5,
  },
  videoContainer: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GreyFill,
    padding: 5,
  },
  addImage: {
    height: 75,
    width: 75,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: GreyStroke,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  filename: {
    fontSize: 10,
    fontFamily: 'ReemKufi-Bold',
    color: TextColor,
  },
});
