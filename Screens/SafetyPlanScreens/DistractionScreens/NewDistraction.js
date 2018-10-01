import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import { PressableIcon } from '../../../Components/PressableIcon';
import store from '../../../Redux/store';
import { updateDistraction, getDistraction } from '../../../Redux/actions';
import Expo from 'expo';
import { Icons } from '../../../Constants/Icon';

import { TabStyles } from '../../../Styles/TabStyles';
import { updateDatabase, updateDatabaseArgument, readDatabaseArg } from '../../../Util/DatabaseHelper';
import { DbTableNames, UsageFunctionIds } from '../../../Constants/Constants';
import { latestSafetyPlanItem } from '../../../Util/Usage';

const Form = t.form.Form;

const distraction = t.struct({
  distractName: t.String,
  distractDesc: t.String,
  distractUrl: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
  fields: {
    distractName: {
      placeholder: 'Name',
      auto: 'none',
    },
    distractDesc: {
      placeholder: 'Description',
      auto: 'none',
    },
    distractUrl: {
      placeholder: 'URL (eg. www.google.ie)',
      auto: 'none',
      autoCapitalize: 'none',
    },
  },
};
// for customizing form UI

export default class NewDistraction extends React.Component {
  static navigationOptions = {
    title: 'New Thing',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: null,
      selectedMediaUri: '',
      selectedMediaName: '',
      selectedMediaType: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const checkedDistractions = nextProps.navigation.getParam('checkedDistractions', null);

    if (checkedDistractions !== this.props.navigation.getParam('checkedDistractions', null)) {
      if (checkedDistractions !== null) {
        this.setState({
          value: {
            distractName: checkedDistractions[0],
            distractDesc: '',
            distractUrl: '',
          },
        });
      } else {
        console.log('no distraction checked');
      }
    }
  }
  // listen for new props coming from pre-populated screen and update accordingly

  onChange = (value) => {
    this.setState({ value: value });
  };

  updateDistractionList = (distraction) => {
    store.dispatch(updateDistraction(distraction));
    // dispatching new Distraction name to global redux store
  };

  refreshDb = (func) => {
    readDatabaseArg('*', 'Distraction', func, () => console.log('DB read success'), 'where dateDeleted is NULL');
  };
  // for refreshing global state from Distraction table in DB

  updateGlobalDistractions = (distractions) => store.dispatch(getDistraction(distractions));

  checkMediaSelected = (distractId) => {
    if (this.state.selectedMediaUri !== '') {
      this.updateDBMedia(distractId);
    }

    this.refreshDb(this.updateGlobalDistractions);

    this.updateFunctionUsage(distractId.insertId);
    // keeping track of new distract entries for 'my stats'

    this.updateLinkDbTable(distractId);
  };
  // if media was selected -> update that row with path

  updateFunctionUsage = (distractId) => {
    latestSafetyPlanItem(UsageFunctionIds.lastEntered.distraction, distractId, this.state.value.distractName);
  };

  updateLinkDbTable = (distractId) => {
    const checkedContacts = this.props.navigation.getParam('checkedContacts', null);

    if (checkedContacts !== null) {
      checkedContacts.forEach((contactId) => {
        updateDatabase('DistractContactLink', [contactId, distractId.insertId], ['contactId', 'distractId']);
      });
    } else {
      console.log('no contacts checked');
    }

    readDatabaseArg(
      '*',
      'Distraction',
      (distractions) => store.dispatch(getDistraction(distractions)),
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
  };

  updateDBMedia = (distractId) => {
    const mediaDirectory = 'SafetyplanMedia/';

    updateDatabaseArgument(
      'Distraction',
      [Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName, this.state.selectedMediaType],
      ['mediaPath', 'mediaType'],
      'where distractId = ' + distractId.insertId
    );

    Expo.FileSystem.moveAsync({
      from: this.state.selectedMediaUri,
      to: Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName,
    });
  };
  // update selected row with media path and copy file from cache to permanent directory

  takePhoto = () => {
    Expo.Permissions.askAsync(Expo.Permissions.CAMERA).then((response) => {
      if (response.status !== 'granted') {
        console.log('Camera permission not granted!');
        return;
      }

      Expo.ImagePicker.launchCameraAsync().then((mediaShot) => {
        console.log(mediaShot);

        if (!mediaShot.cancelled) {
          const splitName = mediaShot.uri.split('/');
          const shortName = splitName[splitName.length - 1];

          this.setState({
            selectedMediaUri: mediaShot.uri,
            selectedMediaName: shortName,
            selectedMediaType: mediaShot.type,
          });
        }
      });
    });
  };
  // sets the state based on the media item that is taken via camera

  captureMedia = () => {
    Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL).then((response) => {
      if (response.status !== 'granted') {
        console.error('Camera roll permission not granted!');
        return;
      }

      Expo.ImagePicker.launchImageLibraryAsync({ mediaTypes: Expo.ImagePicker.MediaTypeOptions.All }).then(
        (selectedMedia) => {
          console.log(selectedMedia);

          if (!selectedMedia.cancelled) {
            const splitName = selectedMedia.uri.split('/');
            const shortName = splitName[splitName.length - 1];

            this.setState({
              selectedMediaUri: selectedMedia.uri,
              selectedMediaName: shortName,
              selectedMediaType: selectedMedia.type,
            });
          }
        }
      );
    });
  };
  // sets the state based on the media item that is selected

  onPress = () => {
    const value = this.refs.form.getValue();
    // returns values captured in form as object

    if (value) {
      // if validation fails, value will be null
      console.log(value);
      updateDatabase(
        'Distraction',
        Object.values(value),
        Object.keys(value),
        this.updateDistractionList(value),
        this.checkMediaSelected
      );
      // write the saved values to DB if valid

      this.props.navigation.pop();
      // pop to distraction list once saved
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={distractionStyle.formContainer}>
          <Form ref="form" type={distraction} value={this.state.value} onChange={this.onChange} options={options} />
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('prePopDistraction')}
            name="Import"
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={distractionStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('contactLink')}
            name="Contact"
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={distractionStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <TouchableHighlight style={distractionStyle.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={distractionStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
        <View style={distractionStyle.iconContainer}>
          <PressableIcon
            iconName={Icons.media + '-outline'}
            size={80}
            onPressFunction={this.captureMedia}
            buttonStyle={distractionStyle.iconButton}
          />
          <PressableIcon
            iconName={Icons.camera + '-outline'}
            size={80}
            onPressFunction={this.takePhoto}
            buttonStyle={distractionStyle.iconButton}
          />
        </View>
      </View>
    );
  }
}

const distractionStyle = StyleSheet.create({
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
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
