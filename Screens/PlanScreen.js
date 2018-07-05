import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import {TabStyles} from "../Styles/TabStyles";
import {SafetyPlanSelector} from "../Components/SafetyPlanSelector";

export default class PlanScreen extends React.Component {
    static navigationOptions = {
        title: "Safety Plan"
    };

    handleItemPress = screen => {
        this.props.navigation.push(screen);
    };
    // function that navigates to selected SP screen

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <SafetyPlanSelector iconName={"ios-warning-outline"} iconSize={50} name="Warning Signs" press={this.handleItemPress} screen="warning"/>
                <SafetyPlanSelector iconName={"ios-build-outline"} iconSize={50} name="Coping Strategies" press={this.handleItemPress} screen="coping"/>
                <SafetyPlanSelector iconName={"ios-body-outline"} iconSize={50} name="Life Worth Living" press={this.handleItemPress} screen="reason"/>
                <SafetyPlanSelector iconName={"ios-paper-plane-outline"} iconSize={50} name="Distractions" press={this.handleItemPress} screen="distraction"/>
                <SafetyPlanSelector iconName={"ios-call-outline"} iconSize={50} name="Contacts" press={this.handleItemPress} screen="contact"/>
                <SafetyPlanSelector iconName={"ios-checkmark-circle-outline"} iconSize={50} name="Making the Environment Safe" press={this.handleItemPress} screen="environment"/>
            </View>
        );
    }
}
