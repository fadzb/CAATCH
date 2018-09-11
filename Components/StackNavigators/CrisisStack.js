import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';

import CrisisScreen from '../../Screens/CrisisScreen';

const CrisisStack = createStackNavigator(
  {
    main: CrisisScreen,
  },

  {
    initialRouteName: 'main',
  }
);
// Crisis stack navigator

CrisisStack.navigationOptions = {
  tabBarIcon: ({ focused, tintColor }) => (
    <Ionicons
      name={Icons.contacts + `${focused ? '' : '-outline'}`}
      // if icon is not pressed use outline
      size={25}
      color={tintColor}
    />
  ),
};
// setting tab icon of CrisisStack to diary icon

export default CrisisStack;
