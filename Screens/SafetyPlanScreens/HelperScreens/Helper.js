import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { readDatabaseArg, updateDatabaseArgument } from '../../../Util/DatabaseHelper';
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow';
import { connect } from 'react-redux';
import { getHelper } from '../../../Redux/actions';
import store from '../../../Redux/store';
import Moment from 'moment';
import { FileSystem } from 'expo';
import { Icons } from '../../../Constants/Icon';
import { compareDates } from '../../../Util/Compare';
import { DbTableNames, SectionHeader } from '../../../Constants/Constants';
import { themeStyles } from '../../../Styles/TabStyles';

class Helper extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: SectionHeader.helpers,
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('newHelper')}>
          <Text style={[{ padding: 10 }, themeStyles.headerRightText]}>New +</Text>
        </TouchableOpacity>
      ),
    };
  };
  // Implementation for 'new' helper button

  componentDidMount() {
    this.getCompleteList();
  }

  updateHelpers = (helpers) => {
    store.dispatch(getHelper(helpers));
    // dispatching total list of helper names from DB to global redux store
  };

  getCompleteList = () => {
    readDatabaseArg(
      'h.*, c.contactId, c.firstName, c.surname',
      DbTableNames.helper,
      this.updateHelpers,
      () => console.log('DB read success'),
      ' as h inner join ' + DbTableNames.contact + ' as c' + ' on h.contactId = c.contactId where h.dateDeleted is NULL'
    );
  };
  // fetching all helpers that do not have a deleted date

  editHelper = (id, name, responsibility, contactId) => {
    this.props.navigation.push('editHelper', {
      id: id,
      name: name,
      resp: responsibility,
      contactId: contactId,
    });
  };

  deleteHelper = (id) => {
    updateDatabaseArgument(
      DbTableNames.helper,
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateDeleted'],
      'where helperId = ' + id,
      () => console.log('deleting helper...'),
      (res) => this.getCompleteList()
    );
  };
  // deleting pressed helper and updating redux global store to re-render the helper list.

  showAlert = (id) => {
    Alert.alert(
      'Delete Helper',
      'Are you sure you want to delete this helper?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteHelper(id), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  summaryNav = (id, contactId, name, date, responsibility) => {
    this.props.navigation.push('helperSummary', {
      id: id,
      contactId: contactId,
      name: name,
      date: date,
      responsibility: responsibility,
    });
  };

  renderItem = ({ item }) => (
    <View style={helperStyle.listContainer}>
      <SafetyPlanSectionRow
        name={item.firstName + `${item.surname !== null ? ' ' + item.surname : ''}`}
        onPress={() =>
          this.summaryNav(
            item.helperId,
            item.contactId,
            item.firstName + `${item.surname !== null ? ' ' + item.surname : ''}`,
            item.dateEntered,
            item.responsibility
          )
        }
        deleteFunction={() => this.showAlert(item.helperId)}
        editFunction={() =>
          this.editHelper(
            item.helperId,
            item.firstName + `${item.surname !== null ? ' ' + item.surname : ''}`,
            item.responsibility,
            item.contactId
          )
        }
        icon={Icons.helpers}
      />
    </View>
  );

  render() {
    return (
      <View style={helperStyle.viewContainer}>
        <FlatList
          data={this.props.helper.sort(compareDates)} // comes from mapStateToProps below
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const helperStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const mapStateToProps = (state) => ({
  helper: state.helper,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Helper);
// HOC that re-renders the component automatically every time a particular section of state is updated
