import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

export const ContactRow = (props) => {
  return (
    <View style={contactRowStyle.container}>
      <TouchableHighlight underlayColor="#FDEDEC" style={contactRowStyle.button} onPress={props.onPress}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={contactRowStyle.buttonText}>{props.name}</Text>
          <Text style={contactRowStyle.numberText}>{props.number}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

ContactRow.propTypes = {
  name: PropTypes.string,
  number: PropTypes.string,
};
// Defining prop types for this component

const contactRowStyle = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    marginLeft: 30,
    marginRight: 30,
  },

  container: {
    flex: 1,
    height: 80,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 20,
    //alignSelf: 'center',
  },

  numberText: {
    fontSize: 16,
    paddingTop: 10,
  },
});
