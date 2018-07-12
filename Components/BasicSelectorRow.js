import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

// Component used for simple pressable rows

export const BasicSelectorRow = (props) => {
  return (
    <View style={basicSelectorRowStyle.container}>
      <TouchableHighlight underlayColor="#FDEDEC" style={basicSelectorRowStyle.button} onPress={props.onPress}>
        <Text style={basicSelectorRowStyle.buttonText}>{props.name}</Text>
      </TouchableHighlight>
    </View>
  );
};

BasicSelectorRow.propTypes = {
  name: PropTypes.string,
};
// Defining prop types for this component

const basicSelectorRowStyle = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-around',
    //alignItems: "center",
    borderBottomWidth: 1,
    marginLeft: 30,
    marginRight: 30,
  },

  container: {
    flex: 1,
    height: 30,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 16,
  },
});
