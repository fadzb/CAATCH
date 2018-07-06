import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { checkDB } from './Util/DatabaseConnector';
import { Provider } from 'react-redux';
import store from './Redux/store';

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
