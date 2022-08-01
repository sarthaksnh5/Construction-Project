import {Dimensions, StyleSheet, Platform} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
    position: 'absolute',
    left: 5,
    fontWeight: 'bold',
    bottom: 5,
    color: '#fff',
  },
  item: {
    width: '100%',
    height: screenWidth - 120, //height will be 20 units less than screen width.
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    marginBottom: Platform.select({ios: 0, android: 1}), //handle rendering bug.
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    backgroundColor: 'rgb(230,0,0)',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  inactiveDotStyle: {
    backgroundColor: 'rgb(255,230,230)',
  },
});
export default styles;
