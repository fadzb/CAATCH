import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { readDatabaseArg, updateDatabaseArgument } from '../../../Util/DatabaseHelper';
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow';
import { connect } from 'react-redux';
import { getCoping } from '../../../Redux/actions';
import store from '../../../Redux/store';
import Moment from 'moment';
import { FileSystem } from 'expo';

class CopingStrategies extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Coping Strategies',
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('newCoping')}>
          <Text style={{ padding: 10 }}>New +</Text>
        </TouchableOpacity>
      ),
    };
  };
  // Implementation for 'new' strategy button

  componentDidMount() {
    this.getCompleteList();
  }

  updateStrategies = (strats) => {
    store.dispatch(getCoping(strats));
    // dispatching total list of coping strategy names from DB to global redux store
  };

  getCompleteList = () => {
    readDatabaseArg(
      '*',
      'CopingStrategy',
      this.updateStrategies,
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
  };
  // fetching all coping strategies that do not have a deleted date

  deleteStrat = (id, path) => {
    this.removeMediaFile(path);

    updateDatabaseArgument(
      'CopingStrategy',
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateDeleted'],
      'where copeId = ' + id,
      () => console.log('deleting strategy...'),
      (res) => this.getCompleteList()
    );
  };
  // deleting pressed strategy and updating redux global store to re-render the strategy list.

  removeMediaFile = (path) => {
    FileSystem.deleteAsync(path)
      .then((res) => console.log('strategy media deleted..'))
      .catch((err) => console.log(err));
  };
  // remove media file from SP media folder in documentDirectory

  showAlert = (id, path) => {
    Alert.alert(
      'Delete Strategy',
      'Are you sure you want to delete this coping strategy?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteStrat(id, path), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  summaryNav = (id, name, date, desc, url, media, mediaType) => {
    this.props.navigation.push('stratSummary', {
      id: id,
      name: name,
      date: date,
      desc: desc,
      url: url,
      media: media,
      mediaType: mediaType,
    });
  };

  render() {
    return (
      <View style={stratStyle.viewContainer}>
        <FlatList
          data={this.props.coping} // comes from mapStateToProps below
          renderItem={({ item }) => (
            <View style={stratStyle.listContainer}>
              <SafetyPlanSectionRow
                name={item.copeName}
                onPress={() =>
                  this.summaryNav(
                    item.copeId,
                    item.copeName,
                    item.dateEntered,
                    item.copeDesc,
                    item.copeUrl,
                    item.mediaPath,
                    item.mediaType
                  )
                }
                delete={true}
                deleteFunction={() => this.showAlert(item.copeId, item.mediaPath)}
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
  coping: state.coping,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(CopingStrategies);
// HOC that re-renders the component automatically every time a particular section of state is updated
