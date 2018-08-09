import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Switch } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

export const SettingsSelectionRow = (props) => {
  return (
    <View style={settingRowStyle.container}>
      <TouchableHighlight underlayColor="#FDEDEC" style={settingRowStyle.button} onPress={props.onPress}>
        <View style={settingRowStyle.rowContainer}>
          <View style={settingRowStyle.textContainer}>
            <Icon name={props.iconName} size={30} />
            <Text style={settingRowStyle.buttonText}>{props.name}</Text>
          </View>
          <View>{props.switch && <Switch value={props.switchValue} onValueChange={props.handleSwitch} />}</View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

SettingsSelectionRow.propTypes = {
  name: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  switch: PropTypes.bool,
  onPress: PropTypes.func,
  switchValue: PropTypes.bool,
};
// Defining prop types for this component

const settingRowStyle = StyleSheet.create({
  button: {
    flex: 1,
    borderBottomWidth: 0.5,
    marginLeft: 10,
    marginRight: 10,
  },

  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flex: 1,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 15,
    paddingLeft: 10,
    flex: 1,
  },

  textContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
  },
});
