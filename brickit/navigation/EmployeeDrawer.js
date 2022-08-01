import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import EmployeeHome from '../screens/EmployeeHome/EmployeeHome';
import {BrandColor} from '../constants/colors';
import ProjectTab from './ProjectTab';
import EditProjectScreen from '../screens/EmployeeScreens/EditProjectScreen/EditProjectScreen';
import ProjectDetailTab from './ProjectDetailTab';
import DetailsTaskScreen from '../screens/ProjectDetails/TaskScreen/DetailsTaskScreen';
import MorePhotos from '../screens/ProjectDetails/PhotoScreen/MorePhotos';
import DetailsMaterialScreen from '../screens/ProjectDetails/MaterialScreen/DetailsMaterialScreen';
import ChangePasswordScreen from '../screens/UserDetails/ChangePasswordScreen/ChangePasswordScreen';
import LogoutScreen from './LogoutScreen';
import UserDetailsScreen from '../screens/UserDetails/UserDetailsScreen/UserDetailsScreen';
import Feather from 'react-native-vector-icons/Feather';
import EmployeeSearch from '../screens/EmployeeScreens/EmployeeSearch/EmployeeSearch';

const Drawer = createDrawerNavigator();

const EmployeeDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={({navigation}) => ({
        headerTitle: 'BrickedIN',
        drawerActiveTintColor: BrandColor,
        headerTitleAlign: 'center',
        headerRight: () => (
          <>
            <Feather
              onPress={() => {
                navigation.navigate('EmployeeSearch');
              }}
              style={{marginRight: 20}}
              name="search"
              size={24}
              color={'#000'}
            />
          </>
        ),
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
        name="EmployeeHome"
        component={EmployeeHome}
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
          title: 'My Projects',
        }}
        name="Projects"
        component={ProjectTab}
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
          drawerLabel: () => null,
          title: null,
          drawerItemStyle: {height: 0},
        }}
        name="EditProject"
        component={EditProjectScreen}
      />

      <Drawer.Screen
        options={{
          drawerItemStyle: {height: 0},
        }}
        name="Project"
        component={ProjectDetailTab}
      />

      <Drawer.Screen
        options={{
          drawerItemStyle: {height: 0},
        }}
        component={DetailsTaskScreen}
        name="TaskDetails"
      />
      <Drawer.Screen
        options={{
          drawerItemStyle: {height: 0},
        }}
        component={MorePhotos}
        name="MorePhotos"
      />
      <Drawer.Screen
        options={{
          drawerItemStyle: {height: 0},
        }}
        component={DetailsMaterialScreen}
        name="MaterialDetails"
      />
      <Drawer.Screen
        options={{
          drawerItemStyle: {height: 0},
        }}
        component={EmployeeSearch}
        name="EmployeeSearch"
      />
    </Drawer.Navigator>
  );
};

export default EmployeeDrawer;

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
