import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Paragraph = props => {
  return <Text style={styles.text} {...props} />;
};

export default Paragraph;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'ReemKufi-Regular',
  },
});
