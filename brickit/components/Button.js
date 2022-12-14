import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {BrandColor} from '../constants/colors';

const Button = ({mode = 'primary', text, onPress, isLoading = false}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={[styles.container, styles[`container_${mode}`]]}>
      {!isLoading ? (
        <Text style={[styles.text, styles[`text_${mode}`]]}>{text}</Text>
      ) : (
        <ActivityIndicator
          size={'large'}
          color={mode === 'primary' ? 'white' : BrandColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 43,
    marginVertical: 12,
    borderRadius: 5,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_primary: {
    backgroundColor: BrandColor,
  },
  container_outlined: {
    backgroundColor: 'white',
    borderColor: BrandColor,
    borderWidth: 1.5,
  },
  text: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  text_primary: {
    color: 'white',
  },
  text_outlined: {
    color: BrandColor,
  },
});
