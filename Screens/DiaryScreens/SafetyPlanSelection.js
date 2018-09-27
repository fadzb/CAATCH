import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import CustomMultiPicker from 'react-native-multiple-select-list';
import { readDatabaseArg, updateDatabase, deleteDatabaseRow } from '../../Util/DatabaseHelper';
import Moment from 'moment';
import store from '../../Redux/store';
import { DbTableNames } from '../../Constants/Constants';
import CustomMultiSelectList from '../../Components/CustomMultiSelectList';

export default class SafetyPlanSelection extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const diaryDate = store.getState().diary.date;

    return {
      title: navigation.getParam('title') + ' ' + Moment(diaryDate).format('DD.MM.YYYY'),
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('spSummary', { type: navigation.getParam('type') })}>
          <Text style={{ padding: 10 }}>Archive</Text>
        </TouchableOpacity>
      ),
    };
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      checkedItems: [],
      type: '',
      sessionDate: new Date(),
    };
  }

  componentDidMount() {
    const type = this.props.navigation.getParam('type');
    this.setState({ type: type });

    if (type === 'cope') {
      readDatabaseArg('*', DbTableNames.copingStrategy, this.updateItems, undefined, 'where dateDeleted is NULL');
    } else {
      readDatabaseArg('*', DbTableNames.warningSign, this.updateItems, undefined, 'where dateDeleted is NULL');
    }
  }
  // get safetyplan items based on their type passed down through navigation props

  updateItems = (items) => {
    const testCope = this.state.type === 'cope';
    let struct = {};

    if (testCope) {
      items.forEach((c) => (struct[c.copeId] = c.copeName));
    } else {
      items.forEach((s) => (struct[s.signId] = s.signName));
    }

    this.setState({ items: struct });
  };
  // update checklist with items from pre-populated array

  getCheckedItems = (items) => {
    this.setState({
      checkedItems: items.filter((item) => item !== undefined),
    });
  };
  // Updates state everytime option is checked/unchecked

  createSession = () => {
    updateDatabase(
      DbTableNames.session,
      [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), store.getState().diary.date],
      ['dateEntered', 'diaryDate'],
      undefined,
      (res) => this.handleSave(res.insertId)
    );
  };
  // when user presses save - create session in DB with date recorded at screen opening

  handleSave = (sessionId) => {
    if (this.state.type === 'cope') {
      this.state.checkedItems.forEach((t) => {
        updateDatabase(DbTableNames.copeSession, [sessionId, t], ['sessionId', 'copeId']);
      });
    } else {
      this.state.checkedItems.forEach((t) => {
        updateDatabase(DbTableNames.signSession, [sessionId, t], ['sessionId', 'signId']);
      });
    }

    this.props.navigation.pop();
  };

  render() {
    return (
      <View style={SPSelectionStyle.viewContainer}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CustomMultiSelectList
              options={this.state.items}
              multiple={true} //
              returnValue={this.state.type === 'cope' ? 'copeId' : 'signId'} // label or value
              callback={this.getCheckedItems} // callback, array of selected items
              rowBackgroundColor={'#fff'}
              rowRadius={5}
              iconColor={'#00a2dd'}
              iconSize={25}
              itemStyle={SPSelectionStyle.itemStyle}
              selectedIconName={'ios-checkmark-circle-outline'}
              unselectedIconName={'ios-radio-button-off-outline'}
              search={true}
            />
          </View>
          <TouchableHighlight style={SPSelectionStyle.button} onPress={this.createSession} underlayColor="#99d9f4">
            <Text style={SPSelectionStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const SPSelectionStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
