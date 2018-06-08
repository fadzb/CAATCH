import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import { styles } from '../Styles/TabStyles';
import { SafetyPlanSelector } from '../Components/SafetyPlanSelector';

export default class PlanScreen extends React.Component {
  static navigationOptions = {
    title: 'Safety Plan',
  };

  handleItemPress = (screen) => {
    this.props.navigation.push(screen);
  };
  // function that navigates to selected SP screen

  render() {
    return (
      <View style={styles.stackContainer}>
        <SafetyPlanSelector name="Warning Signs" press={this.handleItemPress} screen="warning" />
        <SafetyPlanSelector name="Coping Strategies" press={this.handleItemPress} screen="coping" />
        <SafetyPlanSelector name="Reasons to Live" press={this.handleItemPress} screen="reason" />
        <SafetyPlanSelector name="Distractions" press={this.handleItemPress} screen="distraction" />
        <SafetyPlanSelector name="Contacts" press={this.handleItemPress} screen="contact" />
        <SafetyPlanSelector name="Making the Environment Safe" press={this.handleItemPress} screen="environment" />
      </View>
    );
  }
}
