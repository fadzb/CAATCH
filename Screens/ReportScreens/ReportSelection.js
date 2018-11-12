import React from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight, Linking, FlatList, Alert, Modal } from 'react-native';
import { CustomSelectionRow } from '../../Components/CustomSelectionRow';
import { Icons } from '../../Constants/Icon';
import { TabStyles } from '../../Styles/TabStyles';
import { CalendarView } from '../../Components/CalendarView';
import Moment from 'moment';

export default class ReportSelection extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'My Reports',
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  toggleModal = (bool) => {
    this.setState({ modalVisible: bool });
  };

  handleDateSelection = (date) => {
    this.props.navigation.push('diaryReport', { date: date.dateString });

    this.toggleModal(false);
  };

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <View style={{ alignSelf: 'stretch' }}>
          <CustomSelectionRow
            name="Safety Plan"
            icon={Icons.plan + '-outline'}
            iconSize={30}
            iconContainer={reportSelectionStyle.iconContainer}
            onPress={() => this.props.navigation.push('spReport')}
            containerStyle={{ flex: 0, height: Dimensions.get('window').height / 11 }}
          />
          <CustomSelectionRow
            name="Diary"
            icon={Icons.diary + '-outline'}
            iconSize={30}
            iconContainer={reportSelectionStyle.iconContainer}
            onPress={() => this.toggleModal(true)}
            containerStyle={{ flex: 0, height: Dimensions.get('window').height / 11 }}
          />
        </View>
        <Modal
          animationType={'slide'}
          visible={this.state.modalVisible}
          transparent={false}
          onRequestClose={() => this.toggleModal(false)}
        >
          <CalendarView
            onPress={() => this.toggleModal(false)}
            dayPress={this.handleDateSelection}
            maxDate={true}
            title={'Select date for last day of report'}
          />
        </Modal>
      </View>
    );
  }
}

const reportSelectionStyle = StyleSheet.create({
  iconContainer: {
    width: Dimensions.get('window').height / 20,
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
