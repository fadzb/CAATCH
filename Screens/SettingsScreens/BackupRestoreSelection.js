import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert, Platform } from 'react-native';
import {CustomSelectionRow} from "../../Components/CustomSelectionRow";
import {Icons} from "../../Constants/Icon";
import {AppColors, TabStyles} from "../../Styles/TabStyles";
import {connect} from 'react-redux'
import store from "../../Redux/store"
import Dialog from "react-native-dialog";
import {updateEmail} from "../../Redux/actions";
import {updateDatabaseArgument} from "../../Util/DatabaseHelper";
import {AppName, DbTableNames} from "../../Constants/Constants";
import Moment from 'moment';
import { Toast } from 'native-base';

const dbFileName = 'caatch.db';
const dbDirectoryName = 'SQLite/';
// file and directory names

const directory = Expo.FileSystem.documentDirectory + dbDirectoryName;
const file = directory + dbFileName;
// uri's for location of .db file and directory

const restoreInstructions = "Android:\n1. Download the .txt file directly to your device\n2. Navigate to the 'Settings' tab in the " + AppName + " app" +
    "\n3. Press the 'Backup and Restore' option\n4. Press the 'Restore' option\n5. A file selection interface will appear. Navigate to the 'Download' folder and select the .txt file you had previously download" +
    "\n6. You will be prompted to ensure that you wish to restore the selected database. If you are, press 'Restore'\n\niOS:\n1. Download the .txt file and move to one of your cloud backup providers eg. iCloud, Dropbox\n2. Navigate to the 'Settings' tab in the " + AppName + " app\n" +
    "3. Press the 'Backup and Restore' option\n4. Press the 'Restore' option\n5. A file selection interface will appear. Select the option for your cloud backup provider and select the .txt file\n" +
    "6. You will be prompted to ensure that you wish to restore the selected database. If you are, press 'Restore'";

class BackupRestoreSelection extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Backup and Restore',
        }
    };

    constructor(props) {
        super(props);

    this.state = {
      dialogVisible: false,
      emailInput: '',
    };
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleSave = () => {
    this.setState({ dialogVisible: false });

    store.dispatch(updateEmail(this.state.emailInput));

    updateDatabaseArgument(DbTableNames.user, [this.state.emailInput], ['email'], 'where userId = 1');
  };

  // above for retrieving backup email address from user

  showAlert = () => {
    Alert.alert(
      'Enter Backup Email',
      'Please enter a backup email address first!',
      [{ text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' }, { text: 'OK' }],
      { cancelable: false }
    );
  };

  // for when user has no email saved an presses 'backup' button

  showRestoreAlert = (uri) => {
    Alert.alert(
      'WARNING',
      'If you press "Restore" all current data will be overwritten with data from selected file.\n\nPreviously saved media will also be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => this.restoreDb(uri), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  // main alert for restoring old .db file

  restorePicker = () => {
    Expo.DocumentPicker.getDocumentAsync({
      // type: '/*.db',
      copyToCacheDirectory: false,
    })
      .then((res) => {
        if (res.type !== 'cancel') {
          if (res.name.includes('caatch.db')) {
            this.showRestoreAlert(res.uri);
          } else {
            Toast.show({
              text: 'Please select correct .db file',
              buttonText: 'Okay',
              duration: 4000,
              style: { marginBottom: 50 },
            });
          }
        }
      })
      .catch((err) => console.log(err));
  };
  // opens document picker and ensures that user selects file that contains 'caatch.db' in title

  restoreDb = (dbFile) => {
    Expo.FileSystem.copyAsync({
      from: dbFile,
      to: file,
    })
      .then((res) => {
        const directoryName = 'SafetyplanMedia/';
        const directory = Expo.FileSystem.documentDirectory + directoryName;

        Expo.FileSystem.deleteAsync(directory).then((res) => Expo.Updates.reload());
      })
      .catch((err) => console.log(err));
  };
  // replaces old db file and restarts app

  emailBackup = () => {
    Expo.MailComposer.composeAsync({
      recipients: [this.props.settings.email],
      subject: 'CAATCH Backup ' + Moment().format('LL'),
      body: 'Hi, please find CAATCH backup attached.',
      attachments: [file],
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  // opens mail app of choice

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <View style={{ height: (Dimensions.get('window').height / 11) * 3, alignSelf: 'stretch' }}>
          <CustomSelectionRow
            name="Backup"
            iconContainer={backupRestoreStyle.iconContainer}
            //onPress={() => this.props.navigation.push('victory')}
            nameStyle={{ paddingLeft: 10 }}
            onPress={this.props.settings.email === 'None' ? this.showAlert : this.emailBackup}
          />
          <CustomSelectionRow
            name="Restore"
            iconContainer={backupRestoreStyle.iconContainer}
            //onPress={() => this.props.navigation.push('vicSkills')}
            nameStyle={{ paddingLeft: 10 }}
            onPress={this.restorePicker}
          />
          <CustomSelectionRow
            name="Set Backup Email"
            iconContainer={backupRestoreStyle.iconContainer}
            //onPress={() => this.props.navigation.push('insights')}
            selectedText={this.props.settings.email}
            selectedTextStyle={{ color: '#c43a31' }}
            selectedTextViewStyle={{ flex: 0.7, alignItems: 'flex-end' }}
            nameStyle={{ paddingLeft: 10 }}
            onPress={this.showDialog}
          />
        </View>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Backup Email</Dialog.Title>
          <Dialog.Description>
            Please enter the email address where you would like backup files to be sent
          </Dialog.Description>
          <Dialog.Input
            placeholder={'Email'}
            onChangeText={(text) => this.setState({ emailInput: text })}
            autoCapitalize={'none'}
          />
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="OK" onPress={this.handleSave} />
        </Dialog.Container>
      </View>
    );
  }
}

const backupRestoreStyle = StyleSheet.create({
    iconContainer: {
        width: Dimensions.get('window').height / 20,
        height: Dimensions.get('window').height / 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const mapStateToProps = state => ({
    settings: state.setting
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(BackupRestoreSelection)
// HOC that re-renders the component automatically every time a particular section of state is updated