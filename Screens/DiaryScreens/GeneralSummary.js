import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Moment from 'moment';
import { SelectionRow } from '../../Components/SelectionRow';
import { Icons } from '../../Constants/Icon';
import store from '../../Redux/store';
import { readDatabaseArg } from '../../Util/DatabaseHelper';
import { DbTableNames } from '../../Constants/Constants';
import { connect } from 'react-redux';
import { updateDate } from '../../Redux/actions';
import { DateChanger } from '../../Components/DateChanger';

export default class GeneralSummary extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Archive',
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      general: [],
      originalDate: store.getState().diary.date,
    };
  }

  componentWillUnmount() {
    store.dispatch(updateDate(Moment(this.state.originalDate)));
  }
  // set global diary date to original dat on back press

  componentDidMount() {
    this.getArchive();
  }
  // query DB for previous general sessions on this date

  backDay = () => {
    const newDate = Moment(store.getState().diary.date).subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss.SSS');

    store.dispatch(updateDate(Moment(newDate)));
    this.getArchive();
  };

  forwardDay = () => {
    const newDate = Moment(store.getState().diary.date).add(1, 'd').format('YYYY-MM-DD HH:mm:ss.SSS');

    store.dispatch(updateDate(Moment(newDate)));
    this.getArchive();
  };

  getArchive = () => {
    const diaryDate = store.getState().diary.date;

    const selectedDate = Moment(diaryDate).format('YYYY-MM-DD');
    const columns =
      'd.sessionId, s.diaryDate, di.scale, s.dateEntered, d.diaryId, d.rating, di.diaryType, di.diaryName, di.info';

    readDatabaseArg(
      columns,
      DbTableNames.diarySession,
      this.transformResults,
      undefined,
      ' as d inner join ' +
        DbTableNames.session +
        ' as s on d.sessionId = s.sessionId inner join ' +
        DbTableNames.diary +
        ' as di on d.diaryId = di.diaryId' +
        " where DATE(diaryDate) = '" +
        selectedDate +
        "' and diaryType = 'General'"
    );
  };

  transformResults = (res) => {
    let resultObj = {};

    res.forEach((r, i, arr) => {
      if (resultObj[r.sessionId] === undefined) {
        resultObj[r.sessionId] = [r];
      } else {
        resultObj[r.sessionId].push(r);
      }
    });

    this.setState({ general: Object.keys(resultObj).map((k) => resultObj[k]) });
  };
  // convert results from DB into desired array format for FlatList component

  renderItem = ({ item }) => (
    <View style={generalSummaryStyle.listContainer}>
      <SelectionRow
        name={Moment(item[0].dateEntered).format('LLL')}
        onPress={() => this.props.navigation.push('generalSession', { resultsArr: item })}
        icon={Icons.generalDiary + '-outline'}
      />
    </View>
  );

  render() {
    return (
      <View style={generalSummaryStyle.viewContainer}>
        <DateChanger
          title={Moment(store.getState().diary.date).format('LL')}
          forwardFunction={this.forwardDay}
          backFunction={this.backDay}
        />
        <FlatList
          data={this.state.general}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const generalSummaryStyle = StyleSheet.create({
  listContainer: {
    alignSelf: 'stretch',
  },

  viewContainer: {
    flex: 1,
  },

  buttonText: {
    fontSize: 18,
    color: '#007AFF',
    alignSelf: 'center',
  },

  button: {
    height: 36,
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
