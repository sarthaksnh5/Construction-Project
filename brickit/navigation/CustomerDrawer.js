import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import CustomerTabNavigation from './CustomerTabNavigation';
import {BrandColor} from '../constants/colors';
import LogoutScreen from './LogoutScreen';
import ChangePasswordScreen from '../screens/UserDetails/ChangePasswordScreen/ChangePasswordScreen';
import UserDetailsScreen from '../screens/UserDetails/UserDetailsScreen/UserDetailsScreen';
import Feather from 'react-native-vector-icons/Feather';
import CustomerPayment from '../screens/CustomerScreen/CustomerPayment/CustomerPayment';
import CustomerTask from '../screens/CustomerScreen/CustomerTasks/CustomerTask';
import CusutomerDetailTask from '../screens/CustomerScreen/CustomerTasks/CusutomerDetailTask';
import CustomerSearch from '../screens/CustomerScreen/CustomerSearch/CustomerSearch';

const Drawer = createDrawerNavigator();

const CustomerDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={({navigation}) => ({
        headerTitle: 'BrickedIN',
        headerRight: () => (
          <>
            <Feather
              onPress={() => {
                navigation.navigate('customerSearch');
              }}
              style={{marginRight: 20}}
              name="search"
              size={24}
              color={'#000'}
            />
          </>
        ),
        drawerActiveTintColor: BrandColor,
        headerTitleAlign: 'center',
      })}
      drawerContent={props => (
        <>
          <View style={{width: '100%', alignItems: 'center', padding: 10}}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/figma/logo.png')}
                style={styles.image}
              />
            </View>
          </View>
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        </>
      )}>
      <Drawer.Screen
        options={{
          title: 'Home',
        }}
        name="CustomerHome"
        component={CustomerTabNavigation}
      />
      <Drawer.Screen
        options={{
          title: 'Profile',
        }}
        name="UserDetail"
        component={UserDetailsScreen}
      />

      <Drawer.Screen
        options={{
          title: 'Payment History',
        }}
        component={CustomerPayment}
        name="customerPayment"
      />

      <Drawer.Screen
        options={{
          title: 'Change Password',
        }}
        component={ChangePasswordScreen}
        name="ChangePassword"
      />

      <Drawer.Screen
        options={{
          title: 'Logout',
        }}
        component={LogoutScreen}
        name="logoutScreen"
      />

      <Drawer.Screen
        options={{
          title: '',
          drawerItemStyle: {height: 0},
        }}
        component={CustomerTask}
        name="customerTask"
      />

      <Drawer.Screen
        options={{
          title: '',
          drawerItemStyle: {height: 0},
        }}
        component={CusutomerDetailTask}
        name="customerDetailTask"
      />

      <Drawer.Screen
        options={{
          title: '',
          drawerItemStyle: {height: 0},
        }}
        component={CustomerSearch}
        name="customerSearch"
      />
    </Drawer.Navigator>
  );
};

export default CustomerDrawer;

const styles = StyleSheet.create({
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
