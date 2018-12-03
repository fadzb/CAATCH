import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { getPrePops } from '../../Constants/Prepopulated';

import { TabStyles } from '../../Styles/TabStyles';
import { SafetyPlanSelector } from '../../Components/SafetyPlanSelector';
import { Icons } from '../../Constants/Icon';
import { SafetyPlanDbTables, SectionHeader } from '../../Constants/Constants';

const iconSize = 46;

export default class PlanScreen extends React.Component {
  static navigationOptions = {
    title: SectionHeader.plan,
  };

  componentDidMount() {
    getPrePops();
    // get all SP prepop items from DB
  }

  handleItemPress = (screen) => {
    this.props.navigation.push(screen);
  };
  // function that navigates to selected SP screen

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <SafetyPlanSelector
          iconName={Icons.warningSign + '-outline'}
          iconSize={iconSize}
          name={SectionHeader.signs}
          press={this.handleItemPress}
          screen="warning"
        />
        <SafetyPlanSelector
          iconName={Icons.copingStrategy + '-outline'}
          iconSize={iconSize}
          name={SectionHeader.strategies}
          press={this.handleItemPress}
          screen="coping"
        />
        <SafetyPlanSelector
          iconName={Icons.distractions + '-outline'}
          iconSize={iconSize}
          name={SafetyPlanDbTables.distraction.title}
          press={this.handleItemPress}
          screen="selectDistraction"
        />
        <SafetyPlanSelector
          iconName={Icons.lifeWorthLiving + '-outline'}
          iconSize={iconSize}
          name={SafetyPlanDbTables.reason.title}
          press={this.handleItemPress}
          screen="reason"
        />
        <SafetyPlanSelector
          iconName={Icons.helpers}
          iconSize={iconSize}
          name={SectionHeader.contacts}
          press={this.handleItemPress}
          screen="contact"
        />
        <SafetyPlanSelector
          iconName={Icons.environmentSafe + '-outline'}
          iconSize={iconSize}
          name={SafetyPlanDbTables.environment.title}
          press={this.handleItemPress}
          screen="environment"
        />
      </View>
    );
  }
}
