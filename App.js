import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { checkDB } from './Constants/DatabaseConnector';

import HomeScreen from './Screens/HomeScreen';
import DiaryScreen from './Screens/DiaryScreen';
import TwitterScreen from './Screens/TwitterScreen';
import SettingsScreen from './Screens/SettingsScreen';
import PlanStack from './Components/StackNavigators/SafetyPlanStack';
//Initial Tab screens/stack navs

export default class App extends React.Component {
  componentDidMount() {
    checkDB();
    // check db file exists and, if not, copy pre-populated .db file to app file system
  }

  render() {
    return <TabBar />;
  }
}

const TabBar = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Plan: PlanStack,
    Diary: DiaryScreen,
    Twitter: TwitterScreen,
    Settings: SettingsScreen,
  },

  {
    tabBarOptions: {
      activeTintColor: '#a41034',
    },
  }
);
//Creating TabBar
