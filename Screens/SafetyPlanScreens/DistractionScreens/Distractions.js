import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { readDatabaseArg, updateDatabaseArgument } from '../../../Util/DatabaseHelper';
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow';
import { connect } from 'react-redux';
import { getDistraction } from '../../../Redux/actions';
import store from '../../../Redux/store';
import Moment from 'moment';
import { FileSystem } from 'expo';
import { Icons } from '../../../Constants/Icon';
import { compareDates } from '../../../Util/Compare';
import { DbTableNames } from '../../../Constants/Constants';
import { themeStyles } from '../../../Styles/TabStyles';

class Distractions extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'My Things',
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('newDistraction')}>
          <Text style={[{ padding: 10 }, themeStyles.headerRightText]}>New +</Text>
        </TouchableOpacity>
      ),
    };
  };
  // Implementation for 'new' distraction button

  componentDidMount() {
    this.getCompleteList();
  }

  updateDistractions = (distractions) => {
    store.dispatch(getDistraction(distractions));
    // dispatching total list of distraction names from DB to global redux store
  };

  getCompleteList = () => {
    readDatabaseArg(
      '*',
      DbTableNames.distraction,
      this.updateDistractions,
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
  };
  // fetching all distractions that do not have a deleted date

  editDistraction = (id, name, desc, url) => {
    this.props.navigation.push('editDistraction', {
      id: id,
      name: name,
      desc: desc,
      url: url,
    });
  };

  deleteDistraction = (id, path) => {
    this.removeMediaFile(path);

    updateDatabaseArgument(
      DbTableNames.distraction,
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateDeleted'],
      'where distractId = ' + id,
      () => console.log('deleting distraction...'),
      (res) => this.getCompleteList()
    );
  };
  // deleting pressed distraction and updating redux global store to re-render the distraction list.

  removeMediaFile = (path) => {
    FileSystem.deleteAsync(path)
      .then((res) => console.log('distraction media deleted..'))
      .catch((err) => console.log(err));
  };
  // remove media file from SP media folder in documentDirectory

  showAlert = (id, path) => {
    Alert.alert(
      'Delete Distraction',
      'Are you sure you want to delete this Distraction?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteDistraction(id, path), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  summaryNav = (id, name, date, desc, url, media, mediaType) => {
    this.props.navigation.push('distractionSummary', {
      id: id,
      name: name,
      date: date,
      desc: desc,
      url: url,
      media: media,
      mediaType: mediaType,
    });
  };

  renderItem = ({ item }) => (
    <View style={distractionStyle.listContainer}>
      <SafetyPlanSectionRow
        name={item.distractName}
        onPress={() =>
          this.summaryNav(
            item.distractId,
            item.distractName,
            item.dateEntered,
            item.distractDesc,
            item.distractUrl,
            item.mediaPath,
            item.mediaType
          )
        }
        deleteFunction={() => this.showAlert(item.distractId, item.mediaPath)}
        editFunction={() =>
          this.editDistraction(item.distractId, item.distractName, item.distractDesc, item.distractUrl)
        }
        videoThumbnail={item.mediaPath !== null && item.mediaType === 'video' ? { uri: item.mediaPath } : undefined}
        thumbnail={item.mediaPath !== null && item.mediaType === 'image' ? { uri: item.mediaPath } : undefined}
        icon={item.mediaPath === null ? Icons.distractions + '-outline' : undefined}
      />
    </View>
  );

  render() {
    return (
      <View style={distractionStyle.viewContainer}>
        <FlatList
          data={this.props.distraction.sort(compareDates)} // comes from mapStateToProps below
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const distractionStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const mapStateToProps = (state) => ({
  distraction: state.distraction,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Distractions);
// HOC that re-renders the component automatically every time a particular section of state is updated
