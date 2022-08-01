import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/EmployeeScreens/HomeScreen/HomeScreen';
import InActiveProject from '../screens/EmployeeScreens/InActive/InActiveProject';
import CompletedProject from '../screens/EmployeeScreens/CompletedProject/CompletedProject';
import ProjectDetailTab from './ProjectDetailTab';

const Tab = createMaterialTopTabNavigator();

const ProjectTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: 'rgba(171, 61, 2, 0.4)',
          height: '100%',
        },
      }}>
      <Tab.Screen name="Active" component={HomeScreen} />
      <Tab.Screen name="Completed" component={CompletedProject} />
      <Tab.Screen name="InActive" component={InActiveProject} />      
    </Tab.Navigator>
  );
};

export default ProjectTab;
