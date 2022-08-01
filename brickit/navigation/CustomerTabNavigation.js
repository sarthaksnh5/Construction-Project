import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {BrandColor} from '../constants/colors';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import CustomerMainScreen from '../screens/CustomerScreen/CustomerMainScreen/CustomerMainScreen';
import GalleryScreen from '../screens/CustomerScreen/GalleryScreen/GalleryScreen';
import DocumentScreen from '../screens/CustomerScreen/DocumentScreen/DocumentScreen';
import PaperScreen from '../screens/CustomerScreen/PaperScreen/PaperScreen';
import {getData} from '../components/AsyncStorageHelpers';
import {userData} from '../constants/StorageHelpers';
import FullScreenLoading from '../components/FullScreenLoading';
import CustomerMaterialScreen from '../screens/CustomerScreen/CustomerMaterialScreen/CustomerMaterialScreen';

const BottomTab = createMaterialBottomTabNavigator();

const CustomerTabNavigation = ({navigation}) => {
  const [userType, setUserType] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    await getData(userData).then(resp => {
      if (resp != null) {
        setUserType(resp.projectType);
      }
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <BottomTab.Navigator
      labeled={true}
      activeColor={'white'}
      inactiveColor={'#ededed'}
      barStyle={{
        backgroundColor: BrandColor,
      }}>
      <BottomTab.Screen
        name="Customer"
        component={CustomerMainScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => (
            <EntypoIcon name="home" size={24} color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={({navigation}) => ({
          title: 'Gallery',
          tabBarIcon: ({color}) => (
            <EntypoIcon name="image" size={24} color={color} />
          ),
        })}
      />

      <BottomTab.Screen
        name="Documents"
        component={DocumentScreen}
        options={({navigation}) => ({
          title: 'Documents',
          tabBarIcon: ({color}) => (
            <EntypoIcon name="text-document-inverted" size={24} color={color} />
          ),
        })}
      />

      {userType == 1 && (
        <BottomTab.Screen
          name="CustomerMaterial"
          component={CustomerMaterialScreen}
          options={({navigation}) => ({
            title: 'Material',
            tabBarIcon: ({color}) => (
              <FontAwesome5 name="atom" size={24} color={color} />
            ),
          })}
        />
      )}

      <BottomTab.Screen
        name="Paper"
        component={PaperScreen}
        options={({navigation}) => ({
          title: 'More',
          tabBarIcon: ({color}) => (
            <Feather name="more-horizontal" size={24} color={color} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
};

export default CustomerTabNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: 120,
  },
  insideConatiner: {
    flexDirection: 'row',
  },
  text: {
    marginHorizontal: 4,
    fontFamily: 'ReemKufi_600SemiBold',
  },
});
