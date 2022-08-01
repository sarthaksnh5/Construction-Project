import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Background from '../../../components/Background';
import {GreyStroke, hitLink, TextColor} from '../../../constants/colors';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {getData} from '../../../components/AsyncStorageHelpers';
import {userData} from '../../../constants/StorageHelpers';
import ImageViewer from 'react-native-image-zoom-viewer';

const GalleryScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPhotos, setShowPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const getPhotos = async id => {
    setIsLoading(true);
    const url = `${hitLink}/project/photo?filter=photos&id=${id}&filter=customer`;

    await fetch(url, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {result, message} = response;
            console.log(message);
            if (result) {
              const photos = message;
              let tempArr = [];
              if (photos.length % 2 == 0) {
                for (let i = 0; i < photos.length; i = i + 2) {
                  let temp = {
                    id: photos[i].id,
                    item1: photos[i].uri,
                    date1: photos[i].date,
                    item2: photos[i + 1].uri,
                    date2: photos[i + 1].date,
                  };
                  tempArr.push(temp);
                }
              } else {
                for (let i = 0; i < photos.length; i = i + 2) {
                  let temp = '';
                  if (photos[i + 1] != undefined) {
                    temp = {
                      id: photos[i].id,
                      item1: photos[i].uri,
                      date1: photos[i].date,
                      item2: photos[i + 1].uri,
                      date2: photos[i + 1].date,
                    };
                  } else {
                    temp = {
                      id: photos[i].id,
                      item1: photos[i].uri,
                      date1: photos[i].date,
                      item2: '',
                      date2: '',
                    };
                  }
                  tempArr.push(temp);
                }
              }
              setShowPhotos(tempArr);
            } else {
              setShowPhotos([]);
              console.log(message);
            }
            setIsLoading(false);
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
      getData(userData).then(resp => {
        getPhotos(resp.id);
      });
    }, []),
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const RenderPhotos = showPhotos.map(item => {
    console.log(item);
    return (
      <View style={styles.imageView} key={item.id}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.insideContainer}>
          <Image source={{uri: item.item1}} style={styles.image} />
          <Text style={styles.text}>{item.date1}</Text>
        </TouchableOpacity>
        {item.item2 != '' && (
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.insideContainer}>
            <Image source={{uri: item.item2}} style={styles.image} />
            <Text style={styles.text}>{item.date2}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  });

  return (
    <Background>
      <View style={styles.card}>
        <View>
          <Text style={styles.heading}>Gallery</Text>
        </View>
        <ScrollView
          style={styles.innerContainer}
          showsVerticalScrollIndicator={false}>
          {showPhotos.length > 0 ? RenderPhotos : <Text>No photos yet</Text>}
        </ScrollView>
      </View>
      <Modal
        animationType="fade"
        onRequestClose={() => {
          setShowModal(false);
        }}
        visible={showModal}>
        <ImageViewer imageUrls={showPhotos} />
      </Modal>
    </Background>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 15,
  },
  heading: {
    fontSize: 25,
    fontFamily: 'ReemKufi-SemiBold',
    color: TextColor,
  },
  innerContainer: {},
  imageView: {
    width: '100%',
    justifyContent: 'space-evenly',
    padding: 2,
    flexDirection: 'row',
  },
  insideContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 18,
  },
});
