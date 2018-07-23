import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';

import DiaryScreen from '../../Screens/DiaryScreens/DiaryScreen';

const DiaryStack = createStackNavigator(
  {
    main: DiaryScreen,
  },

  {
    initialRouteName: 'main',
  }
);
// Diary stack navigator

DiaryStack.navigationOptions = {
  tabBarIcon: ({ focused, tintColor }) => (
    <Ionicons
      name={Icons.diary + `${focused ? '' : '-outline'}`}
      // if icon is not pressed use outline
      size={25}
      color={tintColor}
    />
  ),
};
// setting tab icon of DiaryStack to diary icon

export default DiaryStack;
