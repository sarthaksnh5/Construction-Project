import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainScreens from '../screens/MainScreen/MainScreens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen/ResetPasswordScreen';
import NewPasswordScreen from '../screens/ResetPasswordScreen/NewPasswordScreen';
import {BrandColor} from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import UserDetailsScreen from '../screens/UserDetails/UserDetailsScreen/UserDetailsScreen';
import EditUserDetailsScreen from '../screens/UserDetails/EditUserDetailsScreen/EditUserDetailsScreen';
import ChangePasswordScreen from '../screens/UserDetails/ChangePasswordScreen/ChangePasswordScreen';
import CustomerTabNavigation from './CustomerTabNavigation';
import IndividualScreen from '../screens/ChatScreens/IndividualScreen/IndividualScreen';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import UploadDocuments from '../screens/EmployeeScreens/UploadDocuments/UploadDocuments';
import VideoScreen from '../screens/VideoScreen/VideoScreen';
import ChatNavigation from './ChatNavigation';
import EmployeeDrawer from './EmployeeDrawer';
import CustomerDrawer from './CustomerDrawer';
import UpdateAttendance from '../screens/ProjectDetails/AttendanceScreen/UpdateAttendance';

const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTransparent: true,
            title: '',
          }}
          name="SplashScreen"
          component={SplashScreen}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            headerTransparent: true,
            title: '',
          }}
          name="MainScreen"
          component={MainScreens}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            headerTransparent: true,
            title: '',
          }}
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            headerTransparent: true,
            title: '',
          }}
          name="ResetPassword"
          component={ResetPasswordScreen}
        />

        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="NewPassword"
          component={NewPasswordScreen}
        />

        <Stack.Screen name="Home" component={EmployeeDrawer} />

        {/* <Stack.Screen
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: 'white',
          }}
          name="EditProject"
          component={EditProjectScreen}
        /> */}

        {/* <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              elevation: 5,
            },
            headerTitle: '',
            headerTransparent: true,
            headerRight: () => (
              <View style={styles.specialContainer}>
                <EntypoIcon
                  name="edit"
                  onPress={() => navigation.navigate('EditUserDetails')}
                  size={24}
                  color={'black'}
                />
              </View>
            ),
          })}
          name="UserDetail"
          component={UserDetailsScreen}
        /> */}

        <Stack.Screen
          options={{headerShown: true, headerTransparent: true, title: ''}}
          name="EditUserDetails"
          component={EditUserDetailsScreen}
        />

        <Stack.Screen
          name="ChangePassword"
          options={{
            headerTransparent: true,
            title: '',
          }}
          component={ChangePasswordScreen}
        />

        {/* <Stack.Screen
          options={({navigation}) => ({
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: BrandColor,
            },
            headerTitleStyle: {
              fontFamily: 'ReemKufi-Regular',
            },
            headerRight: () => (
              <View style={styles.specialContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ChatRoom')}
                  style={styles.insideConatiner}>
                  <EntypoIcon name="chat" size={24} color={'white'} />
                  <Text style={styles.specialText}>Chats</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
          name="Project"
          component={ProjectDetailTab}
        /> */}

        {/* <Stack.Screen
          component={DetailsTaskScreen}
          name="TaskDetails"
          options={{
            headerStyle: {
              backgroundColor: BrandColor,
              elevation: 0,
            },
            headerTintColor: 'white',
          }}
        /> */}

        {/* <Stack.Screen
          component={MorePhotos}
          name="MorePhotos"
          options={{
            headerStyle: {
              backgroundColor: BrandColor,
            },
            headerTintColor: 'white',
          }}
        /> */}

        {/* <Stack.Screen
          component={DetailsMaterialScreen}
          name="MaterialDetails"
          options={{
            headerStyle: {
              backgroundColor: BrandColor,
              elevation: 0,
            },
            headerTintColor: 'white',
          }}
        /> */}

        {/* <Stack.Screen
          options={({navigation}) => ({
            headerTitleAlign: 'left',
            title: 'Welcome',
            headerRight: () => (
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ChatRoom')}
                  style={styles.insideConatiner}>
                  <EntypoIcon name="chat" size={24} color={BrandColor} />
                  <Text style={styles.text}>Chats</Text>
                </TouchableOpacity>
                <Icon
                  onPress={() => navigation.navigate('UserDetail')}
                  name="user-circle"
                  size={24}
                  color={BrandColor}
                />
              </View>
            ),
          })}
          name="CustomerNavigator"
          component={CustomerTabNavigation}
        /> */}

        <Stack.Screen name="CustomerNavigator" component={CustomerDrawer} />

        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: BrandColor,
            },
            headerTintColor: 'white',
            title: 'Chats',
          }}
          name="ChatRoom"
          component={ChatNavigation}
        />

        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: BrandColor,
            },
            headerTintColor: 'white',
          }}
          name="IndividualChat"
          component={IndividualScreen}
        />

        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: BrandColor,
            },
            headerTintColor: 'white',
            title: 'Upload Documents',
          }}
          name="UploadScreen"
          component={UploadDocuments}
        />

        <Stack.Screen
          options={{
            title: '',
            headerTransparent: true,
          }}
          name="VideoScreen"
          component={VideoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  specialContainer: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  insideConatiner: {
    flexDirection: 'row',
  },
  text: {
    marginHorizontal: 4,
    fontFamily: 'ReemKufi-SemiBold',
  },
  specialText: {
    color: 'white',
    marginHorizontal: 4,
    fontFamily: 'ReemKufi-SemiBold',
  },
});
