import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import {TabStyles} from "../Styles/TabStyles";

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        tabBarIcon: ({ focused, tintColor }) => (
            <Ionicons
                name={`ios-settings${focused ? "" : "-outline"}`}
                // if icon is not pressed use outline
                size={25}
                color={tintColor}
            />
        )
    };
    // static property called navigationOptions that belongs to all screen components

    render() {
        return (
            <View style={TabStyles.container}>
                <Text>SettingsScreen</Text>
            </View>
        );
    }
}