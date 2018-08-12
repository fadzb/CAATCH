import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Modal, Dimensions } from 'react-native';
import t from 'tcomb-form-native';
import { PressableIcon } from '../../Components/PressableIcon';
import store from '../../Redux/store';
import { updateCoping, getCoping } from '../../Redux/actions';
import Expo from 'expo';
import { Icons } from '../../Constants/Icon';
import { CalendarView } from '../../Components/CalendarView';
import Moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { TabStyles } from '../../Styles/TabStyles';
import { updateDatabase, updateDatabaseArgument, readDatabaseArg } from '../../Util/DatabaseHelper';

const Form = t.form.Form;

const cope = t.struct({
  title: t.String,
  desc: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
  fields: {
    title: {
      placeholder: 'Title',
      auto: 'none',
    },
    desc: {
      placeholder: 'Description',
      auto: 'none',
    },
  },
};
// for customizing form UI

export default class NewSchedule extends React.Component {
  static navigationOptions = {
    title: 'Appointment',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: null,
      schDate: '',
      fromTime: '',
      fromTimeSelected: false,
      toTime: '',
      toTimeSelected: false,
      modalVisible: false,
      timePickerVisible: false,
    };
  }

  onChange = (value) => {
    this.setState({ value: value });
  };

  onPress = () => {
    const value = this.refs.form.getValue();
    // returns values captured in form as object

    if (value) {
      // if validation fails, value will be null
      console.log(value);
      updateDatabase(
        'CopingStrategy',
        Object.values(value),
        Object.keys(value),
        this.updateCopeList(value),
        this.checkMediaSelected
      );
      // write the saved values to DB if valid

      this.props.navigation.pop();
      // pop to strategy list once saved
    }
  };

  toggleModal = (bool) => {
    this.setState({ modalVisible: bool });
  };

  toggleTimePicker = (bool, timeType) => {
    if (timeType === 'from') {
      this.setState({ timePickerVisible: bool, fromTimeSelected: bool });
    } else if (timeType === undefined) {
      this.setState({ timePickerVisible: bool, fromTimeSelected: bool, toTimeSelected: bool });
    } else {
      this.setState({ timePickerVisible: bool, toTimeSelected: bool });
    }
  };

  handleDateSelection = (date) => this.setState({ schDate: date.dateString }, this.toggleModal(false));

  handleTimeSelection = (time) => {
    if (this.state.fromTimeSelected) {
      this.setState({ fromTime: time });
    } else {
      this.setState({ toTime: time });
    }

    this.toggleTimePicker(false);
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={newScheduleStyle.formContainer}>
          <PressableIcon
            iconName={Icons.calendar + '-outline'}
            size={25}
            onPressFunction={(onPress = () => this.toggleModal(true))}
            name={this.state.schDate === '' ? 'Date' : Moment(this.state.schDate).format('LL')}
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={newScheduleStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <PressableIcon
              iconName={Icons.clock + '-outline'}
              size={25}
              onPressFunction={(onPress = () => this.toggleTimePicker(true, 'from'))}
              name={this.state.fromTime === '' ? 'From' : Moment(this.state.fromTime).format('h:mm a')}
              buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
              buttonStyle={newScheduleStyle.timeButton}
              textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
              iconStyle={{ alignSelf: 'center', alignItems: 'center', paddingRight: 10 }}
            />
            <PressableIcon
              iconName={Icons.clock + '-outline'}
              size={25}
              onPressFunction={(onPress = () => this.toggleTimePicker(true, 'to'))}
              name={this.state.toTime === '' ? 'To' : Moment(this.state.toTime).format('h:mm a')}
              buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
              buttonStyle={newScheduleStyle.timeButton}
              textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
              iconStyle={{ alignSelf: 'center', alignItems: 'center', paddingRight: 10 }}
            />
          </View>
          <Form ref="form" type={cope} value={this.state.value} onChange={this.onChange} options={options} />
          <TouchableHighlight style={newScheduleStyle.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={newScheduleStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
        <DateTimePicker
          isVisible={this.state.timePickerVisible}
          mode={'time'}
          onCancel={() => this.toggleTimePicker(false)}
          titleIOS={''}
          onConfirm={this.handleTimeSelection}
        />
        <Modal
          animationType={'slide'}
          visible={this.state.modalVisible}
          transparent={false}
          onRequestClose={() => this.toggleModal(false)}
        >
          <CalendarView onPress={() => this.toggleModal(false)} dayPress={this.handleDateSelection} maxDate={false} />
        </Modal>
      </View>
    );
  }
}

const newScheduleStyle = StyleSheet.create({
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
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  formContainer: {
    margin: 40,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  listButton: {
    height: 36,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
  timeButton: {
    height: 36,
    width: Dimensions.get('window').width / 2.7,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
    //flex: 1
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
