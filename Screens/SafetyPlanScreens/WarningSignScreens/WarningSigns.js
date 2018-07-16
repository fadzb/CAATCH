import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { readDatabase } from '../../../Util/DatabaseHelper';
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow';
import { connect } from 'react-redux';
import { getSign } from '../../../Redux/actions';
import store from '../../../Redux/store';

class WarningSigns extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Warning Signs',
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('newWarning')}>
          <Text style={{ padding: 10 }}>New +</Text>
        </TouchableOpacity>
      ),
    };
  };
  // Implementation for 'new' strategy button

  componentDidMount() {
    readDatabase('*', 'WarningSign', this.updateSigns, () => console.log('DB read success'));
  }

  updateSigns = (signs) => {
    store.dispatch(getSign(signs));
    // dispatching total list of warning signs names from DB to global redux store
  };

  summaryNav = (name, date, desc) => {
    this.props.navigation.push('signSummary', {
      name: name,
      date: date,
      desc: desc,
    });
  };

  render() {
    return (
      <View style={stratStyle.viewContainer}>
        <FlatList
          data={this.props.sign} // comes from mapStateToProps below
          renderItem={({ item }) => (
            <View style={stratStyle.listContainer}>
              <SafetyPlanSectionRow
                name={item.signName}
                onPress={() => this.summaryNav(item.signName, item.dateEntered, item.signDesc)}
                delete={true}
                deleteFunction={() => console.log('deleting ...')}
              />
            </View>
          )}
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
