import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {getPrePops} from "../../Constants/Prepopulated";

import {TabStyles} from "../../Styles/TabStyles";
import {SafetyPlanSelector} from "../../Components/SafetyPlanSelector";
import {Icons} from "../../Constants/Icon";
import {SectionHeader} from "../../Constants/Constants";

const iconSize = 42;

export default class PlanScreen extends React.Component {
    static navigationOptions = {
        title: SectionHeader.plan
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
                <SafetyPlanSelector color={'white'} iconName={Icons.warningSign + "-outline"} iconSize={iconSize} name={SectionHeader.signs} press={this.handleItemPress} screen="warning"/>
                <SafetyPlanSelector color={'white'} iconName={Icons.copingStrategy + "-outline"} iconSize={iconSize} name={SectionHeader.strategies} press={this.handleItemPress} screen="coping"/>
                <SafetyPlanSelector color={'white'} iconName={Icons.lifeWorthLiving + "-outline"} iconSize={iconSize} name="Life Worth Living" press={this.handleItemPress} screen="reason"/>
                <SafetyPlanSelector color={'white'} iconName={Icons.distractions + "-outline"} iconSize={iconSize} name="Things to Do" press={this.handleItemPress} screen="selectDistraction"/>
                <SafetyPlanSelector color={'white'} iconName={Icons.contacts + "-outline"} iconSize={iconSize} name={SectionHeader.contacts} press={this.handleItemPress} screen="contact"/>
                <SafetyPlanSelector color={'white'} iconName={Icons.helpers} iconSize={iconSize} name={SectionHeader.helpers} press={this.handleItemPress} screen="helper"/>
                <SafetyPlanSelector color={'white'} iconName={Icons.environmentSafe + "-outline"} iconSize={iconSize} name="Making the Environment Safe" press={this.handleItemPress} screen="environment"/>
            </View>
        );
    }
}
