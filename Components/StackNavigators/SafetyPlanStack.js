import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';

import PlanScreen from '../../Screens/PlanScreen';
import WarningSigns from '../../Screens/SafetyPlanScreens/WarningSignScreens/WarningSigns';
import NewCopingStrategy from '../../Screens/SafetyPlanScreens/CopingStrategyScreens/NewCopingStrategy';
import ReasonsToLive from '../../Screens/SafetyPlanScreens/ReasonsToLive';
import Distractions from '../../Screens/SafetyPlanScreens/Distractions';
import Contacts from '../../Screens/SafetyPlanScreens/Contacts';
import EnvironmentSafe from '../../Screens/SafetyPlanScreens/EnvironmentSafe';
import CopingStrategies from '../../Screens/SafetyPlanScreens/CopingStrategyScreens/CopingStrategies';
import PrePopCopingStrategies from '../../Screens/SafetyPlanScreens/CopingStrategyScreens/PrePopCopingStrategies';
import StrategySummary from '../../Screens/SafetyPlanScreens/CopingStrategyScreens/StrategySummary';
import CopeWebView from '../../Screens/SafetyPlanScreens/CopingStrategyScreens/CopeWebView';
import NewWarningSign from '../../Screens/SafetyPlanScreens/WarningSignScreens/NewWarningSign';
import CopingStrategyLink from '../../Screens/SafetyPlanScreens/WarningSignScreens/CopingStrategyLink';
import SignSummary from '../../Screens/SafetyPlanScreens/WarningSignScreens/SignSummary';

const PlanStack = createStackNavigator(
  {
    main: PlanScreen,
    warning: WarningSigns,
    newWarning: NewWarningSign,
    copingLink: CopingStrategyLink,
    signSummary: SignSummary,
    coping: CopingStrategies,
    newCoping: NewCopingStrategy,
    prePopCope: PrePopCopingStrategies,
    stratSummary: StrategySummary,
    copeWeb: CopeWebView,
    reason: ReasonsToLive,
    distraction: Distractions,
    contact: Contacts,
    environment: EnvironmentSafe,
  },

  {
    initialRouteName: 'main',
  }
);
// Safety Plan stack navigator

PlanStack.navigationOptions = {
  tabBarIcon: ({ focused, tintColor }) => (
    <Ionicons
      name={Icons.plan + `${focused ? '' : '-outline'}`}
      // if icon is not pressed use outline
      size={25}
      color={tintColor}
    />
  ),
};
// setting tab icon of PlanStack to SP icon

export default PlanStack;
