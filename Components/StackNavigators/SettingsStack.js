import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../../Constants/Icon";
import {Stacks, themeStyles} from "../../Styles/TabStyles";

import SettingsScreen from "../../Screens/SettingsScreens/SettingsScreen";
import BackupRestoreSelection from "../../Screens/SettingsScreens/BackupRestoreSelection";

const SettingsStack = createStackNavigator(
    {
        main: SettingsScreen,
        backupRestore: BackupRestoreSelection
    },

    {
        initialRouteName: "main",
        ...Stacks
    }
);
// Settings stack navigator

SettingsStack.navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
        <Ionicons
            name={Icons.settings + `${focused ? "" : "-outline"}`}
            // if icon is not pressed use outline
            size={25}
            color={tintColor}
        />
    ),
};
// setting tab icon of SettingsStack to diary icon

export default SettingsStack;