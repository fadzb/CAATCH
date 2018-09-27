import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import { DiaryTile } from './DiaryTile';
import { Icons } from '../Constants/Icon';

import Icon from 'react-native-vector-icons/Ionicons';

export const DiaryGrid = (props) => {
  return (
    <View style={gridStyle.container}>
      <View style={gridStyle.rowContainer}>
        <DiaryTile
          onPress={() => props.navigation.push('general', { title: props.date })}
          name="General"
          iconName={Icons.generalDiary + '-outline'}
        />
      </View>
      <View style={gridStyle.rowContainer}>
        <DiaryTile
          onPress={() => props.navigation.push('spSelection', { title: 'Signs', type: 'sign' })}
          name="Warning Sign"
          iconName={Icons.warningSign + '-outline'}
        />
        <DiaryTile
          onPress={() => props.navigation.push('spSelection', { title: 'Strategies', type: 'cope' })}
          name="Coping Strategy"
          iconName={Icons.copingStrategy + '-outline'}
        />
      </View>
      <View style={gridStyle.rowContainer}>
        {props.dbtEnabled && (
          <View style={gridStyle.rowContainer}>
            <DiaryTile
              onPress={() => props.navigation.push('skills', { title: props.date })}
              name="Skills"
              iconName={Icons.skills + '-outline'}
            />
            <DiaryTile
              onPress={() => props.navigation.push('feelings', { title: props.date })}
              name="Feelings"
              iconName={Icons.feelings + '-outline'}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const gridStyle = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
  },

  lastRowContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 15,
  },

  container: {
    flex: 1,
    margin: 15,
  },
});
