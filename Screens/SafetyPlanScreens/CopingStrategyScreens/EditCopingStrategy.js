import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import { PressableIcon } from '../../../Components/PressableIcon';
import store from '../../../Redux/store';
import { updateCoping, getCoping } from '../../../Redux/actions';
import Expo from 'expo';
import { Icons } from '../../../Constants/Icon';

import { TabStyles } from '../../../Styles/TabStyles';
import { updateDatabase, updateDatabaseArgument, readDatabaseArg } from '../../../Util/DatabaseHelper';

const Form = t.form.Form;

const cope = t.struct({
  copeName: t.String,
  copeDesc: t.String,
  copeUrl: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
  fields: {
    copeName: {
      placeholder: 'Name',
      auto: 'none',
    },
    copeDesc: {
      placeholder: 'Description',
      auto: 'none',
    },
    copeUrl: {
      placeholder: 'URL (eg. www.google.ie)',
      auto: 'none',
      autoCapitalize: 'none',
    },
  },
};
// for customizing form UI

export default class EditCopingStrategy extends React.Component {
  static navigationOptions = {
    title: 'Edit Strategy',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: {
        copeName: this.props.navigation.getParam('name'),
        copeDesc: this.props.navigation.getParam('desc'),
        copeUrl: this.props.navigation.getParam('url'),
      },
      selectedMediaUri: '',
      selectedMediaName: '',
      selectedMediaType: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const checkedStrat = nextProps.navigation.getParam('checkedStrats', null);

    if (checkedStrat !== this.props.navigation.getParam('checkedStrats', null)) {
      if (checkedStrat !== null) {
        this.setState({
          value: {
            copeName: checkedStrat[0],
            copeDesc: '',
            copeUrl: '',
          },
        });
      } else {
        console.log('no strat checked');
      }
    }
  }
  // listen for new props coming from pre-populated screen and update accordingly

  onChange = (value) => {
    this.setState({ value: value });
  };

  updateCopeList = (strategy) => {
    store.dispatch(updateCoping(strategy));
    // dispatching new Coping Strategy name to global redux store
  };

  refreshDb = (func) => {
    readDatabaseArg('*', 'CopingStrategy', func, () => console.log('DB read success'), 'where dateDeleted is NULL');
  };
  // for refreshing global state from Coping Strategy table in DB

  updateGlobalStrategies = (strats) => store.dispatch(getCoping(strats));

  checkMediaSelected = () => {
    if (this.state.selectedMediaUri !== '') {
      this.updateDBMedia(this.props.navigation.getParam('id'));
    }

    this.refreshDb(this.updateGlobalStrategies);
  };
  // if media was selected -> update that row with path

  updateDBMedia = (copeId) => {
    const mediaDirectory = 'SafetyplanMedia/';

    updateDatabaseArgument(
      'CopingStrategy',
      [Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName, this.state.selectedMediaType],
      ['mediaPath', 'mediaType'],
      'where copeId = ' + copeId
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
      updateDatabaseArgument(
        'CopingStrategy',
        Object.values(value),
        Object.keys(value),
        'where copeId = ' + this.props.navigation.getParam('id'),
        this.updateCopeList(value),
        this.checkMediaSelected
      );
      // write the saved values to DB if valid

      this.props.navigation.pop();
      // pop to strategy list once saved
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={copeStyle.formContainer}>
          <Form ref="form" type={cope} value={this.state.value} onChange={this.onChange} options={options} />
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('prePopCope', { edit: true })}
            name="Import"
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={copeStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <TouchableHighlight style={copeStyle.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={copeStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
        <View style={copeStyle.iconContainer}>
          <PressableIcon
            iconName={Icons.media + '-outline'}
            size={80}
            onPressFunction={this.captureMedia}
            buttonStyle={copeStyle.iconButton}
          />
          <PressableIcon
            iconName={Icons.camera + '-outline'}
            size={80}
            onPressFunction={this.takePhoto}
            buttonStyle={copeStyle.iconButton}
          />
        </View>
      </View>
    );
  }
}

const copeStyle = StyleSheet.create({
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
