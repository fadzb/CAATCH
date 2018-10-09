import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { readDatabaseArg, updateDatabaseArgument, deleteDatabaseRow } from '../../Util/DatabaseHelper';
import { SafetyPlanSectionRow } from '../../Components/SafetyPlanSectionRow';
import { connect } from 'react-redux';
import { getGoal, getHelper } from '../../Redux/actions';
import store from '../../Redux/store';
import Moment from 'moment';
import { FileSystem } from 'expo';
import { Icons } from '../../Constants/Icon';
import { compareDates } from '../../Util/Compare';
import { DbTableNames, SectionHeader } from '../../Constants/Constants';

class Goals extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: SectionHeader.goals,
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('newGoal')}>
          <Text style={{ padding: 10 }}>New +</Text>
        </TouchableOpacity>
      ),
    };
  };
  // Implementation for 'new' goal button

  componentDidMount() {
    this.getCompleteList();
  }

  updateGoals = (goals) => {
    store.dispatch(getGoal(goals));
    // dispatching total list of goal names from DB to global redux store
  };

  getCompleteList = () => {
    readDatabaseArg(
      'g.*, d.diaryName, d.diaryId, d.scale',
      DbTableNames.goal,
      this.updateGoals,
      () => console.log('DB read success'),
      ' as g inner join ' + DbTableNames.diary + ' as d' + ' on g.diaryId = d.diaryId'
    );
  };
  // fetching all goals that do not have a deleted date

  editGoal = (id, name, desc, rating, diaryId, diaryName) => {
    this.props.navigation.push('editGoal', {
      id: id,
      name: name,
      desc: desc,
      rating: rating,
      diaryId: diaryId,
      diaryName: diaryName,
    });
  };

  deleteGoal = (id) => {
    deleteDatabaseRow(DbTableNames.goal, 'where goalId = ' + id, (res) => {
      this.getCompleteList();
    });
  };
  // deleting pressed goal and updating redux global store to re-render the goal list.

  showAlert = (id) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteGoal(id), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  summaryNav = (id, diaryId, diaryName, name, desc, rating, date) => {
    this.props.navigation.push('goalSummary', {
      id: id,
      diaryId: diaryId,
      diaryName: diaryName,
      name: name,
      desc: desc,
      rating: rating,
      date: date,
    });
  };

  renderItem = ({ item }) => (
    <View style={goalStyle.listContainer}>
      <SafetyPlanSectionRow
        name={item.goalName}
        onPress={() =>
          this.summaryNav(
            item.goalId,
            item.diaryId,
            item.diaryName,
            item.goalName,
            item.goalDescription,
            item.rating,
            item.dateEntered
          )
        }
        deleteFunction={() => this.showAlert(item.goalId)}
        editFunction={() =>
          this.editGoal(item.goalId, item.goalName, item.goalDescription, item.rating, item.diaryId, item.diaryName)
        }
        icon={Icons.goals + '-outline'}
      />
    </View>
  );

  render() {
    return (
      <View style={goalStyle.viewContainer}>
        <FlatList
          data={this.props.goal.sort(compareDates)} // comes from mapStateToProps below
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const goalStyle = StyleSheet.create({
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
  goal: state.goal,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Goals);
// HOC that re-renders the component automatically every time a particular section of state is updated
