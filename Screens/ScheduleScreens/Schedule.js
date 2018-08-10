import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { Icons } from '../../Constants/Icon';
import { DiaryGrid } from '../../Components/DiaryGrid';
import { Agenda } from 'react-native-calendars';
import { connect } from 'react-redux';
import store from '../../Redux/store';
import { updateDate } from '../../Redux/actions';
import { getDiaryPrePops } from '../../Constants/Prepopulated';

import { TabStyles } from '../../Styles/TabStyles';

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
    };
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
      />
    );
  }

  loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }

      const newItems = {};
      Object.keys(this.state.items).forEach((key) => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems,
      });
    }, 1000);

    console.log(`Load Items for ${day.year}-${day.month}`);

    console.log(day.dateString);
  };

  renderItem = (item) => (
    <View style={[styles.item, { height: item.height }]}>
      <Text>{item.name}</Text>
    </View>
  );

  renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text>This is empty date!</Text>
    </View>
  );

  rowHasChanged = (r1, r2) => r1.name !== r2.name;

  timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});
