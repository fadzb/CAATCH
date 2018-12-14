import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';
import { themeStyles, Tiles } from '../Styles/TabStyles';
import { deviceHeight, smallDeviceHeight } from '../Constants/Constants';

export const DiaryTile = (props) => {
  return (
    <View style={tileStyle.container}>
      <TouchableHighlight underlayColor="#FDEDEC" style={[tileStyle.button, themeStyles.tiles]} onPress={props.onPress}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[tileStyle.buttonText, themeStyles.tileFont]}>{props.name}</Text>
          <Icon
            name={props.iconName}
            size={40}
            color={Tiles.iconColor}
            //style={{fontWeight: 800}}
          />
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
    borderRadius: 7,
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: deviceHeight < smallDeviceHeight ? 12 : 14,
    paddingBottom: 10,
  },
});
