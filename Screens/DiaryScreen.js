import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import { styles } from '../Styles/TabStyles';

export default class DiaryScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Ionicons
        name={`ios-book${focused ? '' : '-outline'}`}
        // if icon is not pressed use outline
        size={25}
        color={tintColor}
      />
    ),
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <View style={styles.container}>
        <View style={diaryStyle.calendarContainer}>
          <Calendar style={diaryStyle.calendar} />
        </View>
      </View>
    );
  }
}

const diaryStyle = StyleSheet.create({
  calendar: {
    flex: 0.95,
    paddingTop: 10,
  },

  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
