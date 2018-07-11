// Simple component for rendering a pressable icon. Name (label) prop is optional

import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';

export const PressableIcon = (props) => {
  return (
    <TouchableHighlight underlayColor="#FFF" style={props.buttonStyle} onPress={() => props.onPressFunction()}>
      <View style={props.buttonContainerStyle}>
        {props.name !== '' && <Text style={props.textStyle}>{props.name}</Text>}
        <View style={props.iconStyle}>
          <Icon name={props.iconName} size={props.size} color={props.color} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

PressableIcon.propTypes = {
  name: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  onPressFunction: PropTypes.func,
  color: PropTypes.string,
};
// Defining prop types for this component
