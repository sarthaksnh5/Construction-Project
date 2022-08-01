import {StyleSheet, View, ScrollView, Linking} from 'react-native';
import React, {useState} from 'react';
import Background from '../../components/Background';
import FullScreenLoading from '../../components/FullScreenLoading';
import {hitLink} from '../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import CustomSlider from '../../components/CustomSlider';
import Button from '../../components/Button';

const EmployeeHome = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState();

  const getProjectPhoto = async () => {
    setIsLoading(true);
    const url = `${hitLink}/project/randPhoto`;

    await fetch(url, {
      method: 'GET',
    })
      .then(resp => {
        resp
          .json()
          .then(response => {
            const {message} = response;
            setPhotos(message);
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
      getProjectPhoto();
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
      <ScrollView>
        <View style={styles.imageContainer}>
          <CustomSlider data={photos} />
        </View>
        <View style={styles.empcontainer}>
          <View style={styles.innerContainer}>
            <Button
              text={'My Projects'}
              onPress={() => navigation.navigate('Projects')}
            />
          </View>
          <View style={styles.innerContainer}>
            <Button
              mode="outlined"
              text={'Add a new Payment'}
              onPress={() => Linking.openURL('https://bit.ly/brickedinpayment')}
            />
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

export default EmployeeHome;

const styles = StyleSheet.create({
  empcontainer: {
    width: '100%',
    justifyContent: 'space-between',
  },
  optionBox: {
    width: 75,
    height: 75,
    borderRadius: 20,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  option: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  innerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
});
