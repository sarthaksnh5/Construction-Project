import {StyleSheet} from 'react-native';
import React from 'react';
import {Button as SpecialButton} from 'react-native-paper';

const OperationButton = ({text, onPress, icon, color}) => {
  return (
    <SpecialButton
      mode="contained"
      color={color}
      icon={icon}
      style={styles.button}
      onPress={onPress}>
      {text}
    </SpecialButton>
  );
};

export default OperationButton;

const styles = StyleSheet.create({
  button: {
    elevation: 5,
    width: '100%',
  },
});
