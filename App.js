import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { FileSystem, Asset } from 'expo';

import HomeScreen from './Screens/HomeScreen';
import DiaryScreen from './Screens/DiaryScreen';
import TwitterScreen from './Screens/TwitterScreen';
import SettingsScreen from './Screens/SettingsScreen';
import PlanStack from './Components/StackNavigators/SafetyPlanStack';
//Initial Tab screens/stack navs

export default class App extends React.Component {
  componentDidMount() {
    this.checkDB();
  }

  render() {
    return <TabBar />;
  }

  checkDB = () => {
    const file = FileSystem.documentDirectory + 'SQLite/';
    // uri for location of .db file

    FileSystem.getInfoAsync(file)
      // firstly checking if directory exists
      .then((fileObj) => {
        if (fileObj.exists) {
          console.log('hello, this directory DOES exist');
        } else {
          console.log('hello, this directory DOES NOT exist');
          FileSystem.makeDirectoryAsync(file).catch((err) => console.error(err));
        }
      })
      .then(() =>
        FileSystem.getInfoAsync(file + 'caatch.db')
          // then check if file exists
          .then((fileObj) => {
            if (fileObj.exists) {
              console.log('hello, this file DOES exist');
            } else {
              console.log('hello, this file DOES NOT exist');

              //download file here
              FileSystem.downloadAsync(
                Asset.fromModule(require('./Database/caatch.db')).uri,
                file + '/caatch.db'
              ).catch((err) => console.log(err));

              // Have to download file from project directory in order to copy to Expo file system
            }
          })
          .catch((err) => console.error(err))
      )
      .catch((err) => console.error(err));
  };
  // function checks if .db file exists and copies pre-populated file if not. Does nothing if exists
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
