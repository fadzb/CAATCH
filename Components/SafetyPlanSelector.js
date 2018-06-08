import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

// Component used for each of the SP items on the first SP tab screen

export const SafetyPlanSelector = (props) => {
  return (
    <View style={selectorStyle.container}>
      <TouchableHighlight
        underlayColor="#FDEDEC"
        style={selectorStyle.button}
        onPress={() => props.press(props.screen)}
      >
        <Text style={selectorStyle.buttonText}>{props.name}</Text>
      </TouchableHighlight>
    </View>
  );
};

SafetyPlanSelector.propTypes = {
  press: PropTypes.func.isRequired,
  screen: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
// Defining prop types for this component

const selectorStyle = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
  },

  container: {
    flexDirection: 'row',
    flex: 1,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 20,
  },
});
