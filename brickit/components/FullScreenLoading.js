import {StyleSheet, StatusBar, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {BrandColor} from '../constants/colors';

const FullScreenLoading = () => {
  const [random, setRandom] = useState(0);
  const options = [
    require('../assets/figma/loading.gif'),
    require('../assets/figma/loading2.gif'),
    require('../assets/figma/loading3.gif'),
    require('../assets/figma/loading4.gif'),
  ];

  useEffect(() => {
    setRandom(Math.floor(Math.random() * 4) + 1);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <Image source={options[random]} style={styles.image} />
    </View>
  );
};

export default FullScreenLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
