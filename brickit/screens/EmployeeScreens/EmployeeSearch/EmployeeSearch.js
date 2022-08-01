import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Background from '../../../components/Background';
import TextInput from '../../../components/TextInput';
import {BrandColor} from '../../../constants/colors';

const EmployeeSearch = ({navigation}) => {
  const [inputValue, setInputValue] = useState();
  const defaultList = [
    {
      id: 1,
      image: require('../../../assets/figma/project.png'),
      label: 'My Projects',
      name: 'Projects',
    },
    {
      id: 12,
      image: require('../../../assets/figma/userProfile.png'),
      label: 'Profile',
      name: 'UserDetail',
    },

    {
      id: 11,
      image: require('../../../assets/figma/changePassword.png'),
      label: 'Change Password',
      name: 'ChangePassword',
    },

    {
      id: 9,
      image: require('../../../assets/figma/logout.png'),
      label: 'Logout',
      name: 'logoutScreen',
    },
  ];
  const [optionsList, setOptionsList] = useState(defaultList);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.name)}
      style={styles.container}
      key={item.id}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  const changeText = text => {
    setInputValue(text);
    const fomatted = text.toLowerCase();
    const tempData = [];
    defaultList.map(item => {
      if (item.label.toLowerCase().includes(fomatted)) {
        tempData.push(item);
      }
    });
    setOptionsList(tempData);
  };

  return (
    <Background>
      <View style={styles.topContainer}>
        <TextInput
          label={'Search'}
          icon={'magnify'}
          onChangeText={changeText}
          value={inputValue}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={optionsList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </Background>
  );
};

export default EmployeeSearch;

const styles = StyleSheet.create({
  topContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  listContainer: {
    padding: 5,
    marginTop: '15%',
  },
  container: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 10,
  },
  text: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
