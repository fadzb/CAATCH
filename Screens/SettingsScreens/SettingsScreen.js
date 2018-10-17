import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Toast } from 'native-base';
import {Icons} from "../../Constants/Icon";
import PINCode from '@haskkor/react-native-pincode'
import {updateDatabase, readDatabase, updateDatabaseArgument, readDatabaseArg} from "../../Util/DatabaseHelper";
import {SettingsSelectionRow} from "../../Components/SettingsSelectionRow";
import { Constants } from 'expo';
import { PressableIcon } from '../../Components/PressableIcon';
import { updateDbtSetting } from '../../Redux/actions';
import store from '../../Redux/store';
import Moment from 'moment';
import { updateEmail } from '../../Redux/actions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: "Settings"
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            switchValue: false,
            dbtSwitchValue: false,
            wallpaperSwitchValue: false,
            notificationSwitchValue: false,
            timePickerVisible: false,
            notificationTime: '',
            dataReady: false,
            emailRecipients: {},
            emailModalVisible: false,
            selectedRecipients: [],
        }
    }

const DBT =
  'Dialectical Behaviour Therapy (DBT) is a treatment programme aimed at helping people with ongoing difficulties managing intense emotions';
const NOTIFICATIONS = 'Select a time to receive a diary reminder at every day. Switch off to cancel all notifications';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      switchValue: false,
      dbtSwitchValue: false,
      notificationSwitchValue: false,
      timePickerVisible: false,
      notificationTime: '',
      dataReady: false,
    };

    toggleModal = bool => {
        this.setState({modalVisible: bool})
    };

    handlePinStore = pin => {
        updateDatabaseArgument(DbTableNames.user,
            [pin, 1],
            ['passcode', 'enabled'],
            'where userId = 1',
            this.setState({switchValue: true, modalVisible: false}));
    };
    // saving pin to USER table in DB

    handleSwitch = value => {
        this.setState(prevState => {
            if(prevState.switchValue === true) {
                updateDatabaseArgument(DbTableNames.user,
                    [0],
                    ['enabled'],
                    'where userId = 1')
            }

            return {switchValue: !prevState.switchValue}
        },() => this.toggleModal(this.state.switchValue));
    };

    const notificationTimestamp = dbObject[0].notificationTime;
    const notificationTime = notificationTimestamp ? Moment(notificationTimestamp).format('HH:mm') : '';

    this.setState(
      {
        switchValue: Boolean(switchValue),
        dbtSwitchValue: Boolean(dbtSwitchValue),
        notificationSwitchValue: Boolean(notificationSwitchValue),
        notificationTime: notificationTime,
      },
      () => this.setState({ dataReady: true })
    );

    handleDbtSwitch = value => {
        this.setState(prevState => {
            const newValue = !prevState.dbtSwitchValue;
            const convertBool = newValue ? 1 : 0;

            updateDatabaseArgument(DbTableNames.user, [convertBool], ['dbt'], 'where userId = 1', undefined, res => store.dispatch(updateDbtSetting(newValue)));

            return {dbtSwitchValue: newValue}
        })
    };

    handleWallpaperSwitch = (imageUri, cacheUri) => {
        this.setState({wallpaperSwitchValue: true}, () => {
            Expo.FileSystem.moveAsync(
                {
                    from: cacheUri,
                    to: imageUri
                }
            ).then(res => {
                store.dispatch(updateWallpaper(imageUri))
            });

            updateDatabaseArgument(DbTableNames.user, [1, imageUri], ['wallpaper', 'wallpaperImage'], 'where userId = 1');
        })
    };
    // if valid image selected from captureMedia function, toggle wallpaper switch and update global state and DB values in User table

    captureMedia = () => {
        if(this.state.wallpaperSwitchValue) {
            this.setState({wallpaperSwitchValue: false}, () => {
                updateDatabaseArgument(DbTableNames.user, [0, null], ['wallpaper', 'wallpaperImage'], 'where userId = 1', undefined, res => {
                    this.removeWallpaperMedia(store.getState().setting.wallpaperImage, () => store.dispatch(updateWallpaper('')))
                })
            })
            // if toggle is already switched on, update state and reset wallpaper values in User DB table. Also remove image file from documents directory to reduce storage usage
        } else {
            Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL)
                .then(response => {
                    if (response.status !== "granted") {
                        console.error("Camera roll permission not granted!");
                        return;
                    }

                    Expo.ImagePicker.launchImageLibraryAsync({mediaTypes: Expo.ImagePicker.MediaTypeOptions.Images})
                        .then(selectedMedia => {
                            if (!selectedMedia.cancelled) {
                                const splitName = selectedMedia.uri.split('/');
                                const shortName = splitName[splitName.length - 1];

                                const mediaDirectory = 'SafetyplanMedia/';
                                const imageUri = Expo.FileSystem.documentDirectory + mediaDirectory + shortName;

                                this.handleWallpaperSwitch(imageUri, selectedMedia.uri)
                            }
                        })
                    // open ImagePicker UI
                })
        }
    };
    // sets the state based on the media item that is selected

    removeWallpaperMedia = (path, callback) => {
        Expo.FileSystem.deleteAsync(path).then(res => callback()).catch(err => console.log(err));
    };
    // remove media file from SP media folder in documentDirectory

    handleNotificationSwitch = value => {
        if(!this.state.notificationSwitchValue) {
            Expo.Permissions.askAsync(Expo.Permissions.USER_FACING_NOTIFICATIONS)
                .then(response => {
                    if (response.status !== "granted") {
                        console.log("Notification permission not granted!");

                        Toast.show({
                            text: 'Allow app notifications in device settings!',
                            //buttonText: 'Okay',
                            duration: 2000,
                            style: { marginBottom: 50 }
                        });

                        return;
                    }

                    this.toggleTimePicker(true);

                    // this.toggleNotification(this.checkDiaryEntriesForToday)
                })
        } else {
            Expo.Notifications.cancelAllScheduledNotificationsAsync();

            this.toggleNotification()
        }

        // if switched to on, check if notification permissions granted. If yes, toggle the switch and run the checkDiaryEntriesForToday function. Show Toast if not
    };

    checkDiaryEntriesForToday = (time) => {
        const diaryDate = store.getState().diary.date;
        const selectedDate = Moment(diaryDate).format("YYYY-MM-DD");

        readDatabaseArg('diaryDate',
            DbTableNames.session,
            res => this.sendNotification(res, time),
            undefined,
            " where DATE(diaryDate) = '" + selectedDate + "'");
    };
    // check if and diary entries recorded for today's date

    sendNotification = (res, time) => {
        const localNotification = {
            title: 'Diary Reminder',
            body: "Don't forget to update your diary today!" ,
            android: {
                sound: true,
            },
            ios: {
                sound: true,
            },
        };

        // create local notification object

        let tomorrowNoteTime = new Date(time.getTime());
        tomorrowNoteTime.setDate(tomorrowNoteTime.getDate() + 1);

        // set tomorrow note time to 9am

        let schedulingOptions = {};

        if(res.length === 0) {
            const now = new Date();

            if(now > time) {
                schedulingOptions = {time: tomorrowNoteTime, repeat: 'day'}
            } else {
                schedulingOptions = {time: time, repeat: 'day'}
            }
            // if no entries set notification to go off today at 9am. Or if later than 9 am , set for tomorrow at same time

        } else {
            schedulingOptions = {time: tomorrowNoteTime, repeat: 'day'}
        }
        // if entries do exist for today, set for tomorrow

        // repeat daily

        Expo.Notifications.scheduleLocalNotificationAsync(
            localNotification,
            schedulingOptions
        ).then(res => console.log(res));
    };

    toggleNotification = (time, callback) => {
        this.setState(prevState => {
            const newValue = !prevState.notificationSwitchValue;
            const convertBool = newValue ? 1 : 0;

            if(newValue) {
                updateDatabaseArgument(DbTableNames.user, [convertBool, time], ['notifications', 'notificationTime'], 'where userId = 1');

                return {notificationSwitchValue: newValue}
            } else {
                updateDatabaseArgument(DbTableNames.user, [convertBool, null], ['notifications', 'notificationTime'], 'where userId = 1');

                return {notificationSwitchValue: newValue, notificationTime: ''}
            }
        }, callback)
    };
    // toggle notification switch

    infoAlert = (title, body) => {
        Alert.alert(
            title,
            body,
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };
    // alert for displaying skill info

    toggleTimePicker = bool => {
        this.setState({timePickerVisible: bool})
    };

    handleTimeSelection = time => {
        this.toggleTimePicker(false);

        this.setState({notificationTime: Moment(time).format('HH:mm')});

        this.toggleNotification(time, () => this.checkDiaryEntriesForToday(time))
    };

    getCsvData = () => {
        const columns = 'd.*, s.diaryDate, s.sessionId, ds.rating, ds.dateEntered';

        // readDatabaseArg(columns, DbTableNames.diary, this.createCsvFile, undefined, ' as d inner join ' + DbTableNames.diarySession + ' as ds on d.diaryId = ds.diaryId inner join ' +
        //     DbTableNames.session + ' as s on ds.sessionId = s.sessionId')

        readDatabaseArg(columns, DbTableNames.diary, res => {
            const usageColumns = 'fu.*, f.functionName, u.usageId, u.dateEntered as "usageDate"';

            readDatabaseArg(usageColumns, DbTableNames.functionUsage, usageRes => this.createCsvFile(res, usageRes), undefined, ' as fu inner join ' + DbTableNames.function + ' as f' +
                ' on fu.functionId = f.functionId inner join ' + DbTableNames.usage + ' as u on u.usageId = fu.usageId where fu.usageId is not NULL')
        }, undefined, ' as d inner join ' + DbTableNames.diarySession + ' as ds on d.diaryId = ds.diaryId inner join ' +
            DbTableNames.session + ' as s on ds.sessionId = s.sessionId')
    };

    createCsvFile = (data, usageData) => {
        const headerString = 'Session Id,Diary Id,Diary Name,Diary Type,Min Rating,Max Rating,Rating,Date Entered,Diary Date,Safety Plan Id,Unique Id\n';
        let rowString = '';

        const installationId = Expo.Constants.installationId;

        readDatabaseArg('ws.signId, ws.signName, ss.dateEntered, s.sessionId, s.diaryDate, "Warning Sign" as type', DbTableNames.warningSign, res => {
        // checking for any coping strategy or warning sign links

            res.forEach(r => {
                let updatedName = r.signName;

                if(r.signName.includes(',')) {
                    updatedName = r.signName.replace(',', '-')
                }
                // removing commas from SP names in order to produce correct CSV file

                rowString = rowString + r.sessionId + ',null,' + updatedName + ',' + r.type + ',null,null,null,' + r.dateEntered + ',' + r.diaryDate + ',' + r.signId + ',' + installationId + '\n'
            });

            data.forEach(d => {
                let updatedName = d.diaryName;

                if(d.diaryName.includes(',')) {
                    updatedName = d.diaryName.replace(',', '-')
                }
                // removing commas from diary names in order to produce correct CSV file

                rowString = rowString + d.sessionId + ',' + d.diaryId + ',' + updatedName + ',' + d.diaryType + ',' +d.minRating + ',' + d.scale + ',' + d.rating + ',' + d.dateEntered + ',' + d.diaryDate + ',null,' + installationId + '\n'
            });

            const filePath = Expo.FileSystem.cacheDirectory + 'DiaryResults-'+ Moment().format('DD.MM.YYYY') + '.csv';
            // diary ratings csv creation

            Expo.FileSystem.writeAsStringAsync(filePath, headerString + rowString)
                .then(res => {
                    const usageHeaderString = 'Usage Id,Usage Date,Function Id,Function Name,Timestamp,Table Name,Item Name,Time Spent(ms),Unique Id\n';
                    let usageRowString = '';

                    usageData.forEach(u => {
                        let updatedIdName = u.idName;

                        if(u.idName && u.idName.includes(',')) {
                            updatedIdName = u.idName.replace(',', '-')
                        }
                        // removing commas from idnames in order to produce correct CSV file

                        usageRowString = usageRowString + u.usageId + ',' + u.usageDate + ',' + u.functionId + ',' + u.functionName + ',' + u.dateEntered + ',' + u.tableName + ',' + updatedIdName + ',' + u.functionValue + ',' + installationId + '\n'
                    });

                    const usageFilePath = Expo.FileSystem.cacheDirectory + 'UsageData-'+ Moment().format('DD.MM.YYYY') + '.csv';
                    // usage csv creation

                    Expo.FileSystem.writeAsStringAsync(usageFilePath, usageHeaderString + usageRowString)
                        .then(res => {
                            Expo.MailComposer.composeAsync({
                                recipients: this.state.selectedRecipients,
                                subject: AppName + ' App Data ' + Moment().format('LL'),
                                body: "Hi, please find " + AppName + " diary and usage data attached.",
                                attachments: [filePath, usageFilePath]
                            })
                                .then(result => console.log(result))
                                .then(res => this.handleEmailModalClose())
                                .catch(err => console.log(err))
                        })
                }).catch(err => console.log(err))
        }, undefined, 'as ws inner join ' + DbTableNames.signSession + ' as ss on ss.signId = ws.signId' +
            ' inner join ' + DbTableNames.session + ' as s on s.sessionId = ss.sessionId union all select c.copeId, c.copeName, cs.dateEntered, s.sessionId, s.diaryDate, "Coping Strategy" as type from ' + DbTableNames.copingStrategy + ' as c inner join ' + DbTableNames.copeSession + '' +
            ' as cs on cs.copeId = c.copeId inner join ' + DbTableNames.session + ' as s on s.sessionId = cs.sessionId');

        this.toggleTimePicker(true);

        // this.toggleNotification(this.checkDiaryEntriesForToday)
      });
    } else {
      Expo.Notifications.cancelAllScheduledNotificationsAsync();


    // if switched to on, check if notification permissions granted. If yes, toggle the switch and run the checkDiaryEntriesForToday function. Show Toast if not
  };

  checkDiaryEntriesForToday = (time) => {
    const diaryDate = store.getState().diary.date;
    const selectedDate = Moment(diaryDate).format('YYYY-MM-DD');

    readDatabaseArg(
      'diaryDate',
      DbTableNames.session,
      (res) => this.sendNotification(res, time),
      undefined,
      " where DATE(diaryDate) = '" + selectedDate + "'"
    );
  };
  // check if and diary entries recorded for today's date

  sendNotification = (res, time) => {
    const localNotification = {
      title: 'Diary Reminder',
      body: "Don't forget to update your diary today!",
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
    };

    getEmailRecipients = () => {
        let emailArr = [];

        readDatabase('email', DbTableNames.user, res => {
            if(res[0].email) {

    let tomorrowNoteTime = new Date(time.getTime());
    tomorrowNoteTime.setDate(tomorrowNoteTime.getDate() + 1);

                        return obj
                    }, {})}, () => this.setState({emailModalVisible: true}))

                }, undefined, 'where dateDeleted is NULL and helper = 1')
            } else {
                readDatabaseArg('email', DbTableNames.contact, res => {
                    res.forEach(r => {
                        if(r.email) {
                            emailArr.push(r.email)
                        }
                    });

                    this.setState({emailRecipients: emailArr.reduce((obj, email, i) => {
                        obj[(i + 1).toString()] = email;

      if (now > time) {
        schedulingOptions = { time: tomorrowNoteTime, repeat: 'day' };
      } else {
        schedulingOptions = { time: time, repeat: 'day' };
      }
      // if no entries set notification to go off today at 9am. Or if later than 9 am , set for tomorrow at same time
    } else {
      schedulingOptions = { time: tomorrowNoteTime, repeat: 'day' };
    }
    // if entries do exist for today, set for tomorrow

    // repeat daily

    Expo.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions).then((res) =>
      console.log(res)
    );
  };

  toggleNotification = (time, callback) => {
    this.setState((prevState) => {
      const newValue = !prevState.notificationSwitchValue;
      const convertBool = newValue ? 1 : 0;

      if (newValue) {
        updateDatabaseArgument(
          DbTableNames.user,
          [convertBool, time],
          ['notifications', 'notificationTime'],
          'where userId = 1'
        );

        return { notificationSwitchValue: newValue };
      } else {
        updateDatabaseArgument(
          DbTableNames.user,
          [convertBool, null],
          ['notifications', 'notificationTime'],
          'where userId = 1'
        );

        return { notificationSwitchValue: newValue, notificationTime: '' };
      }
    }, callback);
  };
  // toggle notification switch

  infoAlert = (title, body) => {
    Alert.alert(title, body, [{ text: 'OK', onPress: () => console.log('OK pressed') }], { cancelable: false });
  };
  // alert for displaying skill info

  toggleTimePicker = (bool) => {
    this.setState({ timePickerVisible: bool });
  };

  handleTimeSelection = (time) => {
    this.toggleTimePicker(false);

    this.setState({ notificationTime: Moment(time).format('HH:mm') });

    this.toggleNotification(time, () => this.checkDiaryEntriesForToday(time));
  };

  render() {
    const NUMBER_OF_TABS = 2;

    return (
      <View style={TabStyles.stackContainer}>
        {this.state.dataReady ? (
          <Container>
            <StyleProvider style={getTheme(platform)}>
              <Tabs prerenderingSiblingsNumber={NUMBER_OF_TABS}>
                <Tab heading={'General'}>
                  <View style={{ flex: 1, alignSelf: 'stretch' }}>
                    <SettingsSelectionRow
                      height={Dimensions.get('window').height / 11}
                      name={'Set Passcode'}
                      iconName={Icons.password + '-outline'}
                      switch={true}
                      switchValue={this.state.switchValue}
                      handleSwitch={() => this.handleSwitch()}
                    />
                    <SettingsSelectionRow
                      height={Dimensions.get('window').height / 11}
                      name={'Notifications'}
                      iconName={Icons.notifications + '-outline'}
                      switch={true}
                      switchValue={this.state.notificationSwitchValue}
                      handleSwitch={() => this.handleNotificationSwitch()}
                      info={true}
                      infoAlert={() =>
                        this.infoAlert(
                          'Notifications',
                          NOTIFICATIONS +
                            (this.state.notificationTime !== ''
                              ? '\n\nCurrent recurring notification time: ' + this.state.notificationTime
                              : '')
                        )
                      }
                    />
                    <SettingsSelectionRow
                      height={Dimensions.get('window').height / 11}
                      name={'Backup and Restore'}
                      iconName={Icons.backup + '-outline'}
                      arrow={true}
                      onPress={() => this.props.navigation.push('backupRestore')}
                    />
                  </View>
                </Tab>
                <Tab heading={'Clinical'}>
                  <View style={{ flex: 1, alignSelf: 'stretch' }}>
                    <SettingsSelectionRow
                      height={Dimensions.get('window').height / 11}
                      name={'DBT'}
                      iconName={Icons.dbt + '-outline'}
                      switch={true}
                      switchValue={this.state.dbtSwitchValue}
                      handleSwitch={() => this.handleDbtSwitch()}
                      info={true}
                      infoAlert={() => this.infoAlert('DBT', DBT)}
                    />
                  </View>
                </Tab>
              </Tabs>
            </StyleProvider>
          </Container>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}

        <DateTimePicker
          isVisible={this.state.timePickerVisible}
          mode={'time'}
          onCancel={() => this.toggleTimePicker(false)}
          titleIOS={'Select a reminder time'}
          onConfirm={this.handleTimeSelection}
          is24Hour={false}
        />
        <Modal
          animationType={'slide'}
          visible={this.state.modalVisible}
          transparent={false}
          onRequestClose={() => this.toggleModal(false)}
        >
          <PressableIcon
            size={45}
            iconName={Icons.closeModal}
            color="black"
            onPressFunction={this.handleCancelModal}
            buttonStyle={{ padding: 20 }}
          />
          <PINCode status={'choose'} storePin={this.handlePinStore} handleResultEnterPin />
        </Modal>
      </View>
    );
  }
}

const settingsStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Constants.statusBarHeight
    },

    itemStyle: {
        borderBottomWidth: 3
    },

    closeButton: {
        paddingLeft: 25,
        alignItems:'flex-start',
        marginTop: Expo.Constants.statusBarHeight
    },

    buttonText: {
        fontSize: 18,
        color: AppColors.white,
        alignSelf: 'center',
        fontWeight: Platform.OS === 'ios' ? '600' : '500'
    },

    button: {
        height: 36,
        backgroundColor: AppColors.orange,
        borderColor: AppColors.orange,
        borderWidth: 1,
        borderRadius: 8,
        margin:15,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});