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
  ActivityIndicator,
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
import { readDatabase } from '../../Util/DatabaseHelper';

export default class Schedule extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Schedule',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      items: {},
      agendaReady: false,
    };
  }

  componentDidMount() {
    readDatabase('*', 'Schedule', (res) => {
      let resultItems = {};

      res.forEach((sch) => {
        resultItems[sch.date] = [{ id: sch.scheduleId, title: sch.title, desc: sch.description, time: sch.time }];
      });

      this.setState({ items: resultItems }, this.setState({ agendaReady: true }));
    });
  }
  // reading DB for saved schedule items. Render agenda component once finished through agenda ready state property

  render() {
    return (
      <View style={scheduleStyle.viewContainer}>
        {this.state.agendaReady ? (
          <Agenda
            items={this.state.items}
            renderItem={this.renderItem}
            renderEmptyData={this.renderEmptyDate}
            rowHasChanged={this.rowHasChanged}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
    );
  }

  getDate = (day, date) => {
    const month = '0' + day.month;
    const dateString = '0' + date;

    return day.year + '-' + month.slice(-2) + '-' + dateString.slice(-2);
  };
  // returns date string in desired text. May need for something else

  renderItem = (item) => (
    <View style={[scheduleStyle.item, { height: item.height }]}>
      <Text>{item.title}</Text>
    </View>
  );

  renderEmptyDate = () => (
    <View style={scheduleStyle.emptyDate}>
      <Text>This is empty date!</Text>
    </View>
  );

  rowHasChanged = (r1, r2) => r1.name !== r2.name;
}

const scheduleStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
