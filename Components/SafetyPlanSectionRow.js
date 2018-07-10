import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

// Component used for rows in the various SP section lists

export const SafetyPlanSectionRow = (props) => {
  return (
    <View style={sectionRowStyle.container}>
      <TouchableHighlight underlayColor="#FDEDEC" style={sectionRowStyle.button} onPress={props.onPress}>
        <Text style={sectionRowStyle.buttonText}>{props.name}</Text>
      </TouchableHighlight>
    </View>
  );
};

SafetyPlanSectionRow.propTypes = {
  name: PropTypes.string,
};
// Defining prop types for this component

const sectionRowStyle = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
  },

  container: {
    flex: 1,
    height: 80,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 20,
  },
});
