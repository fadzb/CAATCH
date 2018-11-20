import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../../Constants/Icon";

import DiaryScreen from '../../Screens/DiaryScreens/DiaryScreen'
import Skills from "../../Screens/DiaryScreens/Skills";
import Feelings from "../../Screens/DiaryScreens/Feelings";
import General from "../../Screens/DiaryScreens/General";
import SafetyPlanSelection from "../../Screens/DiaryScreens/SafetyPlanSelection";
import FeelingsSummary from "../../Screens/DiaryScreens/FeelingsSummary";
import FeelingsSession from "../../Screens/DiaryScreens/FeelingsSession";
import GeneralSummary from "../../Screens/DiaryScreens/GeneralSummary";
import GeneralSession from "../../Screens/DiaryScreens/GeneralSession";
import SafetyPlanSummary from "../../Screens/DiaryScreens/SafetyPlanSummary";
import SafetyPlanSession from "../../Screens/DiaryScreens/SafetyPlanSession";
import {SectionHeader} from "../../Constants/Constants";
import NewDbtItem from "../../Screens/DiaryScreens/NewDbtItem";
import {Stacks, themeStyles} from "../../Styles/TabStyles";

const DiaryStack = createStackNavigator(
    {
        main: DiaryScreen,
        skills: Skills,
        feelings: Feelings,
        feelingsSummary: FeelingsSummary,
        feelingsSession: FeelingsSession,
        general: General,
        generalSummary: GeneralSummary,
        generalSession: GeneralSession,
        spSelection: SafetyPlanSelection,
        spSummary: SafetyPlanSummary,
        spSession: SafetyPlanSession,
        newDbtItem: NewDbtItem
    },

    {
        initialRouteName: "main",
        ...Stacks
    }
);
// Diary stack navigator

DiaryStack.navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
        <Ionicons
            name={Icons.diary + `${focused ? "" : "-outline"}`}
            // if icon is not pressed use outline
            size={25}
            color={tintColor}
        />
    ),
    title: SectionHeader.diary
};
// setting tab icon of DiaryStack to diary icon

export default DiaryStack;