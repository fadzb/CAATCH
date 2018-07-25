import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { checkDB } from './Util/DatabaseConnector';
import { mediaDirectoryCheck } from './Util/Media';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { getPrePops, getDiaryPrePops } from './Constants/Prepopulated';

import HomeScreen from './Screens/HomeScreen';
import DiaryScreen from './Screens/DiaryScreens/DiaryScreen';
import TwitterScreen from './Screens/TwitterScreen';
import SettingsScreen from './Screens/SettingsScreen';
import PlanStack from './Components/StackNavigators/SafetyPlanStack';
import DiaryStack from './Components/StackNavigators/DiaryStack';
//Initial Tab screens/stack navs

export default class App extends React.Component {
  componentDidMount() {
    checkDB();
    // check db file exists and, if not, copy pre-populated .db file to app file system

    mediaDirectoryCheck();
    // checks to ensure media directory exists and creates if not

    getPrePops();
    // get all SP prepop items from DB

    getDiaryPrePops();
    // get all diary prepop items from DB
  }

  render() {
    return (
      <Provider store={store}>
        <TabBar />
      </Provider>
    );
  }
  // Wrapping entire application in Provider component imported from 'react-redux'. Needed so every child component has access to store
}

const TabBar = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Plan: PlanStack,
    Diary: DiaryStack,
    News: TwitterScreen,
    Settings: SettingsScreen,
  },

  {
    tabBarOptions: {
      activeTintColor: '#a41034',
    },
  }
);
//Creating TabBar
