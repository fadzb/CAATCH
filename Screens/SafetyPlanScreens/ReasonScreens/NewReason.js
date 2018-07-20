import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import { PressableIcon } from '../../../Components/PressableIcon';
import store from '../../../Redux/store';
import { updateReason, getReason } from '../../../Redux/actions';
import Expo from 'expo';
import { Icons } from '../../../Constants/Icon';

import { TabStyles } from '../../../Styles/TabStyles';
import { updateDatabase, updateDatabaseArgument, readDatabaseArg } from '../../../Util/DatabaseHelper';

const Form = t.form.Form;

const reason = t.struct({
  reasonName: t.String,
  reasonDesc: t.String,
  reasonUrl: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
  fields: {
    reasonName: {
      placeholder: 'Name',
      auto: 'none',
    },
    reasonDesc: {
      placeholder: 'Description',
      auto: 'none',
    },
    reasonUrl: {
      placeholder: 'URL (eg. www.google.ie)',
      auto: 'none',
      autoCapitalize: 'none',
    },
  },
};
// for customizing form UI

export default class NewReason extends React.Component {
  static navigationOptions = {
    title: 'New Reason',
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

  onChange = (value) => {
    this.setState({ value: value });
  };

  updateReasonList = (reason) => {
    store.dispatch(updateReason(reason));
    // dispatching new Reason name to global redux store
  };

  refreshDb = (func) => {
    readDatabaseArg('*', 'Reason', func, () => console.log('DB read success'), 'where dateDeleted is NULL');
  };
  // for refreshing global state from Reason table in DB

  updateGlobalReasons = (reasons) => store.dispatch(getReason(reasons));

  checkMediaSelected = (reasonId) => {
    if (this.state.selectedMediaUri !== '') {
      this.updateDBMedia(reasonId);
    }

    this.refreshDb(this.updateGlobalReasons);
  };
  // if media was selected -> update that row with path

  updateDBMedia = (reasonId) => {
    const mediaDirectory = 'SafetyplanMedia/';

    updateDatabaseArgument(
      'Reason',
      [Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName, this.state.selectedMediaType],
      ['mediaPath', 'mediaType'],
      'where reasonId = ' + reasonId.insertId
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
        console.error('Camera permission not granted!');
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
        'Reason',
        Object.values(value),
        Object.keys(value),
        this.updateReasonList(value),
        this.checkMediaSelected
      );
      // write the saved values to DB if valid

      this.props.navigation.pop();
      // pop to reason list once saved
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={reasonStyle.formContainer}>
          <Form ref="form" type={reason} value={this.state.value} onChange={this.onChange} options={options} />
          <TouchableHighlight style={reasonStyle.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={reasonStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
        <View style={reasonStyle.iconContainer}>
          <PressableIcon
            iconName={Icons.media + '-outline'}
            size={80}
            onPressFunction={this.captureMedia}
            buttonStyle={reasonStyle.iconButton}
          />
          <PressableIcon
            iconName={Icons.camera + '-outline'}
            size={80}
            onPressFunction={this.takePhoto}
            buttonStyle={reasonStyle.iconButton}
          />
        </View>
      </View>
    );
  }
}

const reasonStyle = StyleSheet.create({
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
