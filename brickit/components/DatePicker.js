import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {TextInput as Input} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {BrandColor} from '../constants/colors';

const DatePicker = ({date, setDate, ...props}) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const parsingDate = date => {
    const newData = new Date(date);

    const finalDate =
      newData.getFullYear().toString() +
      '-' +
      (newData.getMonth() + 1).toString() +
      '-' +
      newData.getDate().toString();
    setDate(finalDate);
    setIsDatePickerVisible(false);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setIsDatePickerVisible(true);
      }}
      style={styles.container}>
      <Input
        mode="outlined"
        underlineColor="transparent"
        activeOutlineColor={BrandColor}
        disabled
        value={date}
        {...props}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={parsingDate}
        onCancel={() => {
          setIsDatePickerVisible(false);
        }}
      />
    </TouchableOpacity>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    color: BrandColor,
    width: '100%',
  },
});
