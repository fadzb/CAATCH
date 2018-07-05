import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';

export const PressableIcon = (props) => {
  return (
    <View style={pressableIconStyle.container}>
      <TouchableHighlight
        underlayColor="#FDEDEC"
        style={pressableIconStyle.button}
        onPress={() => props.onPressFunction()}
      >
        <View style={{ alignItems: 'center' }}>
          {props.name !== '' && <Text style={pressableIconStyle.buttonText}>{props.name}</Text>}
          <Icon name={props.iconName} size={props.size} />
        </View>
      </TouchableHighlight>
    </View>
  );
};

PressableIcon.propTypes = {
  name: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  onPressFunction: PropTypes.func,
};
// Defining prop types for this component

const pressableIconStyle = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 25,
    paddingBottom: 10,
  },
});
