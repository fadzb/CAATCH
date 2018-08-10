import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';

import HomeScreen from '../../Screens/HomeScreen';
import Schedule from '../../Screens/ScheduleScreens/Schedule';

const HomeStack = createStackNavigator(
  {
    main: HomeScreen,
    schedule: Schedule,
  },

  {
    initialRouteName: 'main',
  }
);
// Home stack navigator

HomeStack.navigationOptions = {
  tabBarIcon: ({ focused, tintColor }) => (
    <Ionicons
      name={Icons.home + `${focused ? '' : '-outline'}`}
      // if icon is not pressed use outline
      size={25}
      color={tintColor}
    />
  ),
};
// setting tab icon of Home Stack to home icon

export default HomeStack;
