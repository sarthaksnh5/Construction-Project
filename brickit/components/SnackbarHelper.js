import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Snackbar} from 'react-native-paper';

const SnackbarHelper = ({
  content,
  duration = 6000,
  showSnack,
  setShowSnack,
}) => {
  return (
    <Snackbar
      duration={duration}
      visible={showSnack}
      onDismiss={() => setShowSnack(false)}
      action={{
        label: 'Done',
        onPress: () => {},
      }}>
      {content}
    </Snackbar>
  );
};

export default SnackbarHelper;

const styles = StyleSheet.create({});
