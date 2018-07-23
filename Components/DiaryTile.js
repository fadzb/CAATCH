import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';

export const DiaryTile = (props) => {
  return (
    <View style={tileStyle.container}>
      <TouchableHighlight underlayColor="#FDEDEC" style={tileStyle.button} onPress={props.onPress}>
        <View style={{ alignItems: 'center' }}>
          <Text style={tileStyle.buttonText}>{props.name}</Text>
          <Icon name={props.iconName} size={60} />
        </View>
      </TouchableHighlight>
    </View>
  );
};

DiaryTile.propTypes = {
  name: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};
// Defining prop types for this component

const tileStyle = StyleSheet.create({
  button: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    margin: 5,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 15,
    paddingBottom: 10,
  },
});
