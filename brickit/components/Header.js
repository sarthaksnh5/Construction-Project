import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BrandColor} from '../constants/colors';

const Header = props => {
  return <Text style={styles.header} {...props} />;
};

export default Header;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    color: BrandColor,
    textAlign: 'center',
    paddingVertical: 12,
    fontFamily: 'ReemKufi-Bold',
  },
});
