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

const DiaryStack = createStackNavigator(
    {
        main: DiaryScreen,
        skills: Skills,
        feelings: Feelings,
        general: General,
        spSelection: SafetyPlanSelection
    },

    {
        initialRouteName: "main"
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
};
// setting tab icon of DiaryStack to diary icon

export default DiaryStack;