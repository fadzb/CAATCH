import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {getPrePops} from "../../Constants/Prepopulated";

import {TabStyles} from "../../Styles/TabStyles";
import {SafetyPlanSelector} from "../../Components/SafetyPlanSelector";
import {Icons} from "../../Constants/Icon";

export default class PlanScreen extends React.Component {
    static navigationOptions = {
        title: "Safety Plan"
    };

    componentDidMount() {
        getPrePops();
        // get all SP prepop items from DB
    }

    handleItemPress = screen => {
        this.props.navigation.push(screen);
    };
    // function that navigates to selected SP screen

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <SafetyPlanSelector iconName={Icons.warningSign + "-outline"} iconSize={50} name="Warning Signs" press={this.handleItemPress} screen="warning"/>
                <SafetyPlanSelector iconName={Icons.copingStrategy + "-outline"} iconSize={50} name="Coping Strategies" press={this.handleItemPress} screen="coping"/>
                <SafetyPlanSelector iconName={Icons.lifeWorthLiving + "-outline"} iconSize={50} name="Life Worth Living" press={this.handleItemPress} screen="reason"/>
                <SafetyPlanSelector iconName={Icons.distractions + "-outline"} iconSize={50} name="Things to Do" press={this.handleItemPress} screen="selectDistraction"/>
                <SafetyPlanSelector iconName={Icons.contacts + "-outline"} iconSize={50} name="Contacts" press={this.handleItemPress} screen="contact"/>
                <SafetyPlanSelector iconName={Icons.environmentSafe + "-outline"} iconSize={50} name="Making the Environment Safe" press={this.handleItemPress} screen="environment"/>
            </View>
        );
    }
}
