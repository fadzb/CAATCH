import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";

import PlanScreen from "../../Screens/PlanScreen";
import WarningSigns from "../../Screens/SafetyPlanScreens/WarningSigns";
import NewCopingStrategy from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/NewCopingStrategy";
import ReasonsToLive from "../../Screens/SafetyPlanScreens/ReasonsToLive";
import Distractions from "../../Screens/SafetyPlanScreens/Distractions";
import Contacts from "../../Screens/SafetyPlanScreens/Contacts";
import EnvironmentSafe from "../../Screens/SafetyPlanScreens/EnvironmentSafe";
import CopingStrategies from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/CopingStrategies";
import WarningSignLink from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/WarningSignLink";


const PlanStack = createStackNavigator(
    {
        main: PlanScreen,
        warning: WarningSigns,
        coping: CopingStrategies,
        newCoping: NewCopingStrategy,
        warningLink: WarningSignLink,
        reason: ReasonsToLive,
        distraction: Distractions,
        contact: Contacts,
        environment: EnvironmentSafe
    },

    {
        initialRouteName: "main"
    }
);
// Safety Plan stack navigator

PlanStack.navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
        <Ionicons
            name={`ios-list${focused ? "" : "-outline"}`}
            // if icon is not pressed use outline
            size={25}
            color={tintColor}
        />
    ),
};
// setting tab icon of PlanStack to SP icon

export default PlanStack;