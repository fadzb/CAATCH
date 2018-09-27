import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { readDatabaseArg, updateDatabaseArgument } from '../../../Util/DatabaseHelper';
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow';
import { connect } from 'react-redux';
import { getSign } from '../../../Redux/actions';
import store from '../../../Redux/store';
import Moment from 'moment';
import { Icons } from '../../../Constants/Icon';
import { compareDates } from '../../../Util/Compare';
import { SectionHeader } from '../../../Constants/Constants';

class WarningSigns extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: SectionHeader.signs,
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('newWarning')}>
          <Text style={{ padding: 10 }}>New +</Text>
        </TouchableOpacity>
      ),
    };
  };
  // Implementation for 'new' strategy button

  componentDidMount() {
    this.getCompleteList();
  }

  getCompleteList = () => {
    readDatabaseArg(
      '*',
      'WarningSign',
      this.updateSigns,
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
  };
  // fetching all warning signs that do not have a deleted date

  updateSigns = (signs) => {
    store.dispatch(getSign(signs));
    // dispatching total list of warning signs names from DB to global redux store
  };

  editSign = (id, name, desc) => {
    this.props.navigation.push('editWarning', {
      id: id,
      name: name,
      desc: desc,
    });
  };

  deleteSign = (id) => {
    updateDatabaseArgument(
      'WarningSign',
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateDeleted'],
      'where signId = ' + id,
      () => console.log('deleting sign...'),
      (res) => this.getCompleteList()
    );
  };
  // deleting pressed strategy and updating redux global store to re-render the strategy list

  showAlert = (id) => {
    Alert.alert(
      'Delete Sign',
      'Are you sure you want to delete this warning sign?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteSign(id), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  summaryNav = (id, name, date, desc) => {
    this.props.navigation.push('signSummary', {
      id: id,
      name: name,
      date: date,
      desc: desc,
    });
  };

  renderItem = ({ item }) => (
    <View style={stratStyle.listContainer}>
      <SafetyPlanSectionRow
        name={item.signName}
        onPress={() => this.summaryNav(item.signId, item.signName, item.dateEntered, item.signDesc)}
        deleteFunction={() => this.showAlert(item.signId)}
        editFunction={() => this.editSign(item.signId, item.signName, item.signDesc)}
        circleView="WS"
      />
    </View>
  );

  render() {
    return (
      <View style={stratStyle.viewContainer}>
        <FlatList
          data={this.props.sign.sort(compareDates)} // comes from mapStateToProps below
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const stratStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const mapStateToProps = (state) => ({
  sign: state.sign,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(WarningSigns);
// HOC that re-renders the component automatically every time a particular section of state is updated
