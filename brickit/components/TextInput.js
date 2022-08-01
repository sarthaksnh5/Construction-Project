import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextInput as Input} from 'react-native-paper';
import {BrandColor, DangerText, TextColor} from '../constants/colors';

const TextInput = ({
  errorText,
  description,
  secureTextEntry = false,
  isPassword = false,
  setShowPassword,
  icon,
  isAttach = false,
  isAttachPress,
  ...props
}) => {
  const inputIcon = () => {
    if (isAttach) {
      return (
        <Input.Icon
          onPress={isAttachPress}
          name={'attachment'}
          color={BrandColor}
        />
      );
    } else if (isPassword) {
      return (
        <Input.Icon
          onPress={() => {
            setShowPassword(!secureTextEntry);
          }}
          name={secureTextEntry ? 'eye-off' : 'eye'}
          color={BrandColor}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={[styles.container, isAttach ? {} : {marginBottom: 40}]}>
      <Input
        style={styles.input}
        activeOutlineColor={BrandColor}
        underlineColor="transparent"
        mode="outlined"
        left={<Input.Icon style={styles.icon} name={icon} color={BrandColor} />}
        right={inputIcon()}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 55,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  icon: {},
  input: {
    backgroundColor: 'white',
    color: BrandColor,
    width: '100%',
    height: 55,
  },
  description: {
    fontSize: 13,
    color: TextColor,
  },
  error: {
    fontSize: 13,
    color: DangerText,
  },
});
