import {StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getData} from '../components/AsyncStorageHelpers';
import {projectId, userData} from '../constants/StorageHelpers';
import FullScreenLoading from '../components/FullScreenLoading';
import {BrandColor, lightBrand} from '../constants/colors';
import PaymentScreen from '../screens/ProjectDetails/PaymentScreen/PaymentScreen';
import TeamScreen from '../screens/ProjectDetails/TeamScreen/TeamScreen';
import TaskScreen from '../screens/ProjectDetails/TaskScreen/TaskScreen';
import PhotoScreen from '../screens/ProjectDetails/PhotoScreen/PhotoScreen';
import MaterialScreen from '../screens/ProjectDetails/MaterialScreen/MaterialScreen';
import AttendanceScreen from '../screens/ProjectDetails/AttendanceScreen/AttendanceScreen';
import ProjectDocument from '../screens/ProjectDetails/ProjectDocument/ProjectDocument';
import UpdateAttendance from '../screens/ProjectDetails/AttendanceScreen/UpdateAttendance';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DownloadAttendace from '../screens/ProjectDetails/AttendanceScreen/DownloadAttendace';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const AttendaceStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Attendance1" component={AttendanceScreen} />
      <Stack.Screen name="EditAttendace" component={UpdateAttendance} />
      <Stack.Screen name="DownloadLabour" component={DownloadAttendace} />
    </Stack.Navigator>
  );
};

const ProjectDetailTab = ({navigation}) => {
  const [userType, setUserType] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    await getData(userData).then(resp => {
      if (resp != null) {
        setUserType(resp.type);
      }
    });
    await getData(projectId).then(resp => {
      if (resp != null) {
        navigation.setOptions({
          title: resp.name,
        });
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Tab.Navigator
      initialRouteName={userType == 0 || userType == 3 ? 'Payment' : 'Team'}
      screenOptions={{
        tabBarActiveTintColor: BrandColor,
        tabBarPressColor: lightBrand,
        tabBarLabelStyle: {fontSize: 13, fontWeight: 'bold'},
        tabBarItemStyle: {width: 120},
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: 'rgba(171, 61, 2, 0.4)',
          height: '100%',
        },
      }}>
      {userType == 0 || userType == 3 ? (
        <Tab.Screen name="Payment" component={PaymentScreen} />
      ) : null}
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Task" component={TaskScreen} />
      <Tab.Screen name="Photo" component={PhotoScreen} />
      <Tab.Screen name="Material" component={MaterialScreen} />
      <Tab.Screen name="Attendance" component={AttendaceStack} />
      <Tab.Screen name="Documents" component={ProjectDocument} />
    </Tab.Navigator>
  );
};

export default ProjectDetailTab;

const styles = StyleSheet.create({});
