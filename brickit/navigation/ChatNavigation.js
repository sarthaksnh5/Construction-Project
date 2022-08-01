import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FullScreenLoading from '../components/FullScreenLoading';
import {BrandColor} from '../constants/colors';
import IndividualScreen from '../screens/ChatScreens/IndividualScreen/IndividualScreen';
import SingleChat from '../screens/ChatScreens/SingleChat/SingleChat';
import ChatRoom from '../screens/ChatScreens/ChatRoom/ChatRoom';

const Tab = createMaterialTopTabNavigator();

const ChatNavigation = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: BrandColor,
          elevation: 0,
        },
        tabBarActiveTintColor: 'white',
        tabBarPressColor: 'white',
        tabBarIndicatorStyle: {
          backgroundColor: 'rgba(171, 61, 2, 0.4)',
          height: '100%',
        },
      }}>
      <Tab.Screen
        options={{
          title: 'General',
        }}
        name="CustomChat"
        component={SingleChat}
      />
      <Tab.Screen
        options={{
          title: 'Project',
        }}
        name="GroupChat"
        component={ChatRoom}
      />
    </Tab.Navigator>
  );
};

export default ChatNavigation;

const styles = StyleSheet.create({});
