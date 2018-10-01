import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import { Icons } from '../Constants/Icon';

import Icon from 'react-native-vector-icons/Ionicons';

export const DateChanger = (props) => {
  return (
    <View style={dateStyle.header}>
      <Icon name={Icons.dividerArrowBack} size={25} onPress={props.backFunction} />
      <Text style={{ fontSize: 16 }}>{props.title}</Text>
      <Icon name={Icons.dividerArrow} size={25} onPress={props.forwardFunction} />
    </View>
  );
};

const dateStyle = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 5,
    backgroundColor: '#f0f0f5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
  },
});
