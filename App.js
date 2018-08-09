import React from 'react';
import { createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { checkDB } from './Util/DatabaseConnector';
import { mediaDirectoryCheck } from './Util/Media';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { readDatabase, updateDatabase } from './Util/DatabaseHelper';
import Moment from 'moment';
import { updateUsage } from './Redux/actions';
import { AppLoading } from 'expo';

import HomeScreen from './Screens/HomeScreen';
import TwitterScreen from './Screens/TwitterScreen';
import SettingsScreen from './Screens/SettingsScreen';
import PlanStack from './Components/StackNavigators/SafetyPlanStack';
import DiaryStack from './Components/StackNavigators/DiaryStack';
import SettingsStack from './Components/StackNavigators/SettingsStack';
import Passcode from './Screens/Passcode';

//Initial Tab screens/stack navs

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      passcodeEnabled: false,
    };
  }

  postCheckDbFunctions = () => {
    mediaDirectoryCheck();
    // checks to ensure media directory exists and creates if not

    this.createNewUsage();
    // new usage session added to DB
  };

  checkPasscode = () => {
    readDatabase(
      'enabled',
      'User',
      (res) => {
        if (res[0].enabled === 1) {
          this.setState({ passcodeEnabled: true });
        }
      },
      () => this.setState({ isReady: true })
    );
  };
  // checks if user has passcode enabled

  createNewUsage = () => {
    updateDatabase('Usage', [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')], ['dateEntered'], undefined, (res) =>
      store.dispatch(updateUsage(res.insertId))
    );
  };
  // creating new usage transaction in DB and storing usageId in global store

  loadData = () => {
    checkDB(() => this.postCheckDbFunctions());

    //Return promise here for home screen media so it is loaded during splash screen
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadData}
          onFinish={this.checkPasscode}
          //onFinish={() => console.log("Uncomment for deleting DB only")}
          onError={console.warn}
        />
      );
    }
    //splashscreen

    if (this.state.passcodeEnabled) {
      return (
        <Provider store={store}>
          <SwitchNav />
        </Provider>
      );
    }
    //passcode

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
    Settings: SettingsStack,
  },

  {
    tabBarOptions: {
      activeTintColor: '#a41034',
    },
  }
);
//Creating TabBar

const SwitchNav = createSwitchNavigator({
  pass: Passcode,
  main: TabBar,
});
