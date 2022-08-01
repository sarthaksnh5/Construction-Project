import {Dimensions, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CarouselItem from './CarouselItem';
import styles from './styles';
import * as React from 'react';
import {View, Text} from 'react-native';

const {width} = Dimensions.get('window');
export default function CustomSlider({data}) {
  const settings = {
    sliderWidth: width - 20,
    sliderHeight: width,
    itemWidth: width - 10,
    data: data,
    renderItem: CarouselItem,
    hasParallaxImages: true,
  };
  return (
    <View style={styles.container}>
      <Carousel {...settings} />
    </View>
  );
}