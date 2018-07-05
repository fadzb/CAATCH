import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

// Component used for each of the SP items on the first SP tab screen

export const SafetyPlanSelector = (props) => {
  return (
    <View style={selectorStyle.container}>
      <TouchableHighlight
        underlayColor="#FDEDEC"
        style={selectorStyle.button}
        onPress={() => props.press(props.screen)}
      >
        <View style={selectorStyle.textIconContainer}>
          <View style={selectorStyle.iconContainer}>
            <Icon name={props.iconName} size={props.iconSize} />
          </View>
          <View style={selectorStyle.textContainer}>
            <Text style={selectorStyle.buttonText}>{props.name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

SafetyPlanSelector.propTypes = {
  press: PropTypes.func.isRequired,
  screen: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
};
// Defining prop types for this component

const selectorStyle = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  container: {
    flexDirection: 'row',
    flex: 1,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 20,
  },

  textContainer: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
  },

  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  textIconContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
