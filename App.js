import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { checkDB } from './Util/DatabaseConnector';
import { mediaDirectoryCheck } from './Util/Media';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { updateDatabase } from './Util/DatabaseHelper';
import Moment from 'moment';
import { updateUsage } from './Redux/actions';

import HomeScreen from './Screens/HomeScreen';
import TwitterScreen from './Screens/TwitterScreen';
import SettingsScreen from './Screens/SettingsScreen';
import PlanStack from './Components/StackNavigators/SafetyPlanStack';
import DiaryStack from './Components/StackNavigators/DiaryStack';

//Initial Tab screens/stack navs

export default class App extends React.Component {
  componentDidMount() {
    checkDB(() => this.postCheckDbFunctions());
    // check db file exists and, if not, copy pre-populated .db file to app file system
  }

  postCheckDbFunctions = () => {
    mediaDirectoryCheck();
    // checks to ensure media directory exists and creates if not

    this.createNewUsage();
  };

  createNewUsage = () => {
    updateDatabase('Usage', [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')], ['dateEntered'], undefined, (res) =>
      store.dispatch(updateUsage(res.insertId))
    );
  };
  // creating new usage transaction in DB and storing usageId in global store

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
