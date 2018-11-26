import React from 'react';
import { createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { checkDB } from './Util/DatabaseConnector';
import { mediaDirectoryCheck } from './Util/Media';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { readDatabase, updateDatabase } from './Util/DatabaseHelper';
import Moment from 'moment';
import { updateUsage, updateDbtSetting, updateAppState, updateWallpaper } from './Redux/actions';
import { AppLoading } from 'expo';
import { Root } from 'native-base';
import { AppState, Text } from 'react-native';

import PlanStack from './Components/StackNavigators/SafetyPlanStack';
import DiaryStack from './Components/StackNavigators/DiaryStack';
import SettingsStack from './Components/StackNavigators/SettingsStack';
import Passcode from './Screens/Passcode';
import HomeStack from './Components/StackNavigators/HomeStack';
import CrisisStack from './Components/StackNavigators/CrisisStack';
import { DbTableNames, UsageFunctionIds } from './Constants/Constants';

//Initial Tab screens/stack navs

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      passcodeEnabled: false,
      currentTab: '',
      startTime: '',
      endTime: '',
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  postCheckDbFunctions = () => {
    mediaDirectoryCheck();
    // checks to ensure media directory exists and creates if not

    this.createNewUsage();
    // new usage session added to DB

    this.checkSettings();

    Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });
  };

  checkSettings = () => {
    readDatabase(
      '*',
      DbTableNames.user,
      (res) => {
        if (res[0].enabled === 1) {
          this.setState({ passcodeEnabled: true });
        } else {
          this.setState({ currentTab: 'Home' });
        }
        // check passcode

        if (res[0].dbt === 1) {
          store.dispatch(updateDbtSetting(true));
        } else {
          store.dispatch(updateDbtSetting(false));
        }
        // check DBT setting

        if (res[0].wallpaper === 1) {
          store.dispatch(updateWallpaper(res[0].wallpaperImage));
        }
      },
      () => this.setState({ isReady: true })
    );
  };
  // checks if user has passcode enabled

  createNewUsage = () => {
    updateDatabase(
      DbTableNames.usage,
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateEntered'],
      undefined,
      (res) => store.dispatch(updateUsage(res.insertId))
    );
  };
  // creating new usage transaction in DB and storing usageId in global store

  loadData = () => {
    checkDB(this.postCheckDbFunctions);

    //Return promise here for home screen media so it is loaded during splash screen
  };

  handleAppStateChange = (nextAppState) => {
    if (store.getState().app.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({
        startTime: new Date().getTime(),
      });

      // if app goes from inactive/background to active, reset start time state
    } else if (store.getState().app === 'active' && (nextAppState === 'background' || nextAppState === 'inactive')) {
      if (Object.values(trackScreens).includes(this.state.currentTab)) {
        updateDatabase(
          DbTableNames.functionUsage,
          [
            UsageFunctionIds.session[this.state.currentTab],
            store.getState().usage,
            new Date().getTime() - this.state.startTime,
          ],
          ['functionId', 'usageId', 'functionValue']
        );

        // if app goes from active to inactive/background, push session time record to DB
      }
    }
  };

  handleTabChange = (tab) => {
    this.setState((prevState) => {
      const prevTab = prevState.currentTab;

      if (prevTab !== tab) {
        if (Object.values(trackScreens).includes(prevTab)) {
          updateDatabase(
            DbTableNames.functionUsage,
            [UsageFunctionIds.session[prevTab], store.getState().usage, new Date().getTime() - this.state.startTime],
            ['functionId', 'usageId', 'functionValue'],
            undefined,
            (res) => {
              this.setState({
                currentTab: tab,
                startTime: new Date().getTime(),
              });
            }
          );
        } else {
          return {
            currentTab: tab,
            startTime: new Date().getTime(),
          };
        }
      }
    });
  };

  // when moving between tabs, record time of session to DB and reset start time and currentTab states

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadData}
          //onFinish={this.postCheckDbFunctions}
          onFinish={() => console.log('loading finished')}
          onError={console.warn}
        />
      );
    }
    //splashscreen

    if (this.state.passcodeEnabled) {
      return (
        <Provider store={store}>
          <Root>
            <SwitchNav
              onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getActiveRouteNamePasscode(currentState);
                const prevScreen = getActiveRouteNamePasscode(prevState);

                if (currentScreen && prevScreen) {
                  if (prevScreen.routeName !== currentScreen.routeName) {
                    if (currentScreen.routeName === 'Home' && currentScreen.routes[1]) {
                      this.handleTabChange(currentScreen.routes[1].routeName);
                    } else {
                      this.handleTabChange(currentScreen.routeName);
                    }
                  }
                } else if (currentScreen) {
                  if (currentScreen.routeName === 'Home' && currentScreen.routes[1]) {
                    this.handleTabChange(currentScreen.routes[1].routeName);
                  } else {
                    this.handleTabChange(currentScreen.routeName);
                  }
                }
              }}
            />
          </Root>
        </Provider>
      );
    }
    //passcode

    return (
      <Provider store={store}>
        <Root>
          <TabBar
            onNavigationStateChange={(prevState, currentState) => {
              const currentScreen = getActiveRouteName(currentState);
              const prevScreen = getActiveRouteName(prevState);

              if (currentScreen && prevScreen) {
                if (prevScreen.routeName !== currentScreen.routeName) {
                  if (currentScreen.routeName === 'Home' && currentScreen.routes[1]) {
                    this.handleTabChange(currentScreen.routes[1].routeName);
                  } else {
                    this.handleTabChange(currentScreen.routeName);
                  }
                }
              } else if (currentScreen) {
                if (currentScreen.routeName === 'Home' && currentScreen.routes[1]) {
                  this.handleTabChange(currentScreen.routes[1].routeName);
                } else {
                  this.handleTabChange(currentScreen.routeName);
                }
              }
            }}
          />
        </Root>
      </Provider>
    );
  }
  // Wrapping entire application in Provider component imported from 'react-redux'. Needed so every child component has access to store
}

const TabBar = createBottomTabNavigator(
  {
    Home: HomeStack,
    Plan: PlanStack,
    Diary: DiaryStack,
    Crisis: CrisisStack,
    Settings: SettingsStack,
  },

  {
    tabBarOptions: {
      //activeTintColor: "#31548B"
      //activeTintColor: "#F09100"
      activeTintColor: '#2E9797',
    },
  }
);
//Creating TabBar

const SwitchNav = createSwitchNavigator({
  pass: Passcode,
  main: TabBar,
});

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators

  if (!route.isTransitioning) {
    return route;
  }
}

function getActiveRouteNamePasscode(navigationState) {
  if (!navigationState) {
    return null;
  }

  if (navigationState.index === 1) {
    const allRoutes = navigationState.routes[navigationState.index];

    const route = allRoutes.routes[allRoutes.index];

    if (!route.isTransitioning) {
      return route;
    }
  }
}

const trackScreens = {
  stats: 'statSelection',
  goals: 'goals',
  reports: 'reportSelection',
  plan: 'Plan',
  diary: 'Diary',
};
