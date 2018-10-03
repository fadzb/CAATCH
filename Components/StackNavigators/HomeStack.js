import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';

import HomeScreen from '../../Screens/HomeScreen';
import Schedule from '../../Screens/ScheduleScreens/Schedule';
import NewSchedule from '../../Screens/ScheduleScreens/NewSchedule';
import VicChart from '../../Screens/StatScreens/VicChart';
import StatSelection from '../../Screens/StatScreens/StatSelection';
import Insights from '../../Screens/StatScreens/Insights';
import Reports from '../../Screens/ReportScreens/Reports';
import Pdf from '../../Screens/ReportScreens/Pdf';
import VicSkillsChart from '../../Screens/StatScreens/VicSkillsChart';

const HomeStack = createStackNavigator(
  {
    main: HomeScreen,
    schedule: Schedule,
    newSchedule: NewSchedule,
    statSelection: StatSelection,
    insights: Insights,
    victory: VicChart,
    vicSkills: VicSkillsChart,
    reports: Reports,
    pdf: Pdf,
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
